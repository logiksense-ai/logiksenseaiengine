"""
IntentGraph AI — Real Data Research Engine
Every function in this module fetches REAL data from the internet.
No mock data. No fabricated values. If a source returns nothing, we return None.
"""

import ssl
import socket
import time
import traceback
from typing import Optional
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

import whois
import dns.resolver
import requests
from bs4 import BeautifulSoup


# ── Helpers ─────────────────────────────────────────────────

REQUESTS_TIMEOUT = 10
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

def _safe_str(val) -> Optional[str]:
    """Convert a value to string safely, handling lists and None."""
    if val is None:
        return None
    if isinstance(val, list):
        return ", ".join(str(v) for v in val) if val else None
    if isinstance(val, datetime):
        return val.strftime("%Y-%m-%d")
    return str(val)


def _normalize_domain(query: str) -> str:
    """Extract a clean domain from user input."""
    q = query.strip().lower()
    q = q.replace("https://", "").replace("http://", "").replace("www.", "")
    q = q.split("/")[0]  # remove any path
    if "." not in q:
        q = q + ".com"  # assume .com if no TLD given
    return q


# ── 1. WHOIS Lookup ────────────────────────────────────────

def lookup_whois(domain: str) -> dict:
    """
    Real WHOIS protocol lookup. Returns registration info.
    Source: WHOIS protocol via python-whois library.
    """
    step = {
        "id": "whois",
        "agentId": 1,
        "agentName": "Company Discovery",
        "description": f"WHOIS protocol lookup for {domain}",
        "sourceUrl": f"https://who.is/whois/{domain}",
        "status": "running",
    }
    start = time.time()
    try:
        w = whois.whois(domain)
        duration = int((time.time() - start) * 1000)
        
        items = []
        
        if w.domain_name:
            items.append({
                "label": "Domain Name",
                "value": _safe_str(w.domain_name) or domain,
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 99
            })
        
        if w.registrar:
            items.append({
                "label": "Registrar",
                "value": _safe_str(w.registrar),
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 98
            })
        
        if w.creation_date:
            created = w.creation_date
            if isinstance(created, list):
                created = created[0]
            items.append({
                "label": "Domain Created",
                "value": _safe_str(created),
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 99
            })
            # Calculate domain age
            if isinstance(created, datetime):
                try:
                    # Handle both timezone-aware and naive datetimes
                    now = datetime.now(created.tzinfo) if created.tzinfo else datetime.now()
                    age_days = (now - created).days
                except TypeError:
                    # Fallback: strip timezone info
                    age_days = (datetime.now() - created.replace(tzinfo=None)).days
                years = age_days // 365
                months = (age_days % 365) // 30
                items.append({
                    "label": "Domain Age",
                    "value": f"{years} years, {months} months",
                    "source": "Calculated from WHOIS creation_date",
                    "sourceUrl": f"https://who.is/whois/{domain}",
                    "confidence": 99
                })

        if w.expiration_date:
            exp = w.expiration_date
            if isinstance(exp, list):
                exp = exp[0]
            items.append({
                "label": "Domain Expires",
                "value": _safe_str(exp),
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 99
            })
        
        if w.name_servers:
            ns = w.name_servers
            if isinstance(ns, list):
                ns_str = ", ".join(sorted(set(s.lower() for s in ns)))
            else:
                ns_str = str(ns)
            items.append({
                "label": "Name Servers",
                "value": ns_str,
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 99
            })
        
        if w.org:
            items.append({
                "label": "Registered Organisation",
                "value": _safe_str(w.org),
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 95
            })

        if w.country:
            items.append({
                "label": "Registrant Country",
                "value": _safe_str(w.country),
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 90
            })

        if w.state:
            items.append({
                "label": "Registrant State",
                "value": _safe_str(w.state),
                "source": "WHOIS Protocol",
                "sourceUrl": f"https://who.is/whois/{domain}",
                "confidence": 88
            })

        step["status"] = "done"
        step["result"] = f"Extracted {len(items)} WHOIS fields"
        step["dataPoints"] = len(items)
        step["durationMs"] = duration
        
        return {
            "step": step,
            "category": "Domain Registration (WHOIS)",
            "items": items
        }
    
    except Exception as e:
        duration = int((time.time() - start) * 1000)
        step["status"] = "error"
        step["result"] = f"WHOIS lookup failed: {str(e)[:100]}"
        step["durationMs"] = duration
        return {"step": step, "category": "Domain Registration (WHOIS)", "items": []}


# ── 2. DNS Records ─────────────────────────────────────────

def lookup_dns(domain: str) -> dict:
    """
    Real DNS resolution. Returns A, MX, NS, TXT records.
    Source: Public DNS resolvers via dnspython.
    """
    step = {
        "id": "dns",
        "agentId": 1,
        "agentName": "Company Discovery",
        "description": f"DNS record resolution for {domain}",
        "sourceUrl": f"https://dns.google/query?name={domain}",
        "status": "running",
    }
    start = time.time()
    items = []
    
    try:
        # A records
        try:
            answers = dns.resolver.resolve(domain, "A")
            ips = [str(r) for r in answers]
            items.append({
                "label": "A Records (IPv4)",
                "value": ", ".join(ips),
                "source": "DNS Resolver",
                "sourceUrl": f"https://dns.google/query?name={domain}&type=A",
                "confidence": 100
            })
        except Exception:
            pass
        
        # MX records
        try:
            answers = dns.resolver.resolve(domain, "MX")
            mx = [f"{r.preference} {r.exchange}" for r in answers]
            items.append({
                "label": "Mail Servers (MX)",
                "value": ", ".join(mx),
                "source": "DNS Resolver",
                "sourceUrl": f"https://dns.google/query?name={domain}&type=MX",
                "confidence": 100
            })
            # Infer email provider
            mx_str = " ".join(mx).lower()
            if "google" in mx_str or "gmail" in mx_str:
                items.append({"label": "Email Provider", "value": "Google Workspace", "source": "Inferred from MX records", "sourceUrl": f"https://dns.google/query?name={domain}&type=MX", "confidence": 95})
            elif "outlook" in mx_str or "microsoft" in mx_str:
                items.append({"label": "Email Provider", "value": "Microsoft 365", "source": "Inferred from MX records", "sourceUrl": f"https://dns.google/query?name={domain}&type=MX", "confidence": 95})
            elif "zoho" in mx_str:
                items.append({"label": "Email Provider", "value": "Zoho Mail", "source": "Inferred from MX records", "sourceUrl": f"https://dns.google/query?name={domain}&type=MX", "confidence": 95})
        except Exception:
            pass

        # NS records
        try:
            answers = dns.resolver.resolve(domain, "NS")
            ns = [str(r) for r in answers]
            items.append({
                "label": "Name Servers (NS)",
                "value": ", ".join(ns),
                "source": "DNS Resolver",
                "sourceUrl": f"https://dns.google/query?name={domain}&type=NS",
                "confidence": 100
            })
        except Exception:
            pass
        
        # TXT records (SPF, DKIM, verification)
        try:
            answers = dns.resolver.resolve(domain, "TXT")
            txt_records = [str(r).strip('"') for r in answers]
            for txt in txt_records:
                if "v=spf1" in txt:
                    items.append({"label": "SPF Record", "value": txt[:120], "source": "DNS TXT Record", "sourceUrl": f"https://dns.google/query?name={domain}&type=TXT", "confidence": 100})
                elif "google-site-verification" in txt:
                    items.append({"label": "Google Verification", "value": "Google Search Console verified", "source": "DNS TXT Record", "sourceUrl": f"https://dns.google/query?name={domain}&type=TXT", "confidence": 100})
                elif "facebook-domain-verification" in txt:
                    items.append({"label": "Facebook Verification", "value": "Facebook domain verified", "source": "DNS TXT Record", "sourceUrl": f"https://dns.google/query?name={domain}&type=TXT", "confidence": 100})
                elif "MS=" in txt or "ms=" in txt:
                    items.append({"label": "Microsoft 365 Verification", "value": "Microsoft domain verified", "source": "DNS TXT Record", "sourceUrl": f"https://dns.google/query?name={domain}&type=TXT", "confidence": 100})
        except Exception:
            pass

        duration = int((time.time() - start) * 1000)
        step["status"] = "done"
        step["result"] = f"Resolved {len(items)} DNS records"
        step["dataPoints"] = len(items)
        step["durationMs"] = duration
        
    except Exception as e:
        duration = int((time.time() - start) * 1000)
        step["status"] = "error"
        step["result"] = f"DNS resolution failed: {str(e)[:100]}"
        step["durationMs"] = duration
    
    return {"step": step, "category": "DNS Records", "items": items}


# ── 3. HTTP Headers & Tech Detection ──────────────────────

def detect_tech_from_headers(domain: str) -> dict:
    """
    Real HTTP HEAD/GET request to detect server technology.
    Source: Live HTTP response headers from the target domain.
    """
    step = {
        "id": "tech_headers",
        "agentId": 8,
        "agentName": "Tech Detection",
        "description": f"HTTP header analysis for {domain}",
        "sourceUrl": f"https://{domain}",
        "status": "running",
    }
    start = time.time()
    items = []
    
    try:
        headers = {"User-Agent": USER_AGENT}
        resp = requests.get(f"https://{domain}", headers=headers, timeout=REQUESTS_TIMEOUT, allow_redirects=True)
        h = resp.headers
        
        # Server
        if "server" in h:
            items.append({
                "label": "Web Server",
                "value": h["server"],
                "source": f"HTTP Server header from {domain}",
                "sourceUrl": f"https://{domain}",
                "confidence": 99
            })
        
        # X-Powered-By
        if "x-powered-by" in h:
            items.append({
                "label": "Powered By",
                "value": h["x-powered-by"],
                "source": f"HTTP X-Powered-By header from {domain}",
                "sourceUrl": f"https://{domain}",
                "confidence": 97
            })
        
        # CDN detection
        cdn = None
        if "cf-ray" in h or "cf-cache-status" in h:
            cdn = "Cloudflare"
        elif "x-vercel-id" in h:
            cdn = "Vercel Edge Network"
        elif "x-amz-cf-id" in h or "x-amz-cf-pop" in h:
            cdn = "Amazon CloudFront"
        elif "x-fastly-request-id" in h:
            cdn = "Fastly"
        elif "x-akamai" in h.get("server", "").lower():
            cdn = "Akamai"
        
        if cdn:
            items.append({
                "label": "CDN / Edge Network",
                "value": cdn,
                "source": "HTTP response header fingerprint",
                "sourceUrl": f"https://{domain}",
                "confidence": 98
            })
        
        # Security headers
        if "strict-transport-security" in h:
            items.append({"label": "HSTS Enabled", "value": "Yes — " + h["strict-transport-security"][:80], "source": "HTTP Strict-Transport-Security header", "sourceUrl": f"https://{domain}", "confidence": 100})
        
        if "content-security-policy" in h:
            items.append({"label": "Content Security Policy", "value": "Configured", "source": "HTTP CSP header present", "sourceUrl": f"https://{domain}", "confidence": 100})
        
        if "x-frame-options" in h:
            items.append({"label": "X-Frame-Options", "value": h["x-frame-options"], "source": "HTTP X-Frame-Options header", "sourceUrl": f"https://{domain}", "confidence": 100})

        # Status code
        items.append({
            "label": "HTTP Status",
            "value": f"{resp.status_code} {resp.reason}",
            "source": f"GET https://{domain}",
            "sourceUrl": f"https://{domain}",
            "confidence": 100
        })

        # Final URL (after redirects)
        if resp.url != f"https://{domain}" and resp.url != f"https://{domain}/":
            items.append({
                "label": "Final Redirect URL",
                "value": resp.url[:120],
                "source": "HTTP redirect chain",
                "sourceUrl": resp.url,
                "confidence": 100
            })

        duration = int((time.time() - start) * 1000)
        step["status"] = "done"
        step["result"] = f"Analyzed {len(items)} header signals"
        step["dataPoints"] = len(items)
        step["durationMs"] = duration
        
    except Exception as e:
        duration = int((time.time() - start) * 1000)
        step["status"] = "error"
        step["result"] = f"HTTP request failed: {str(e)[:100]}"
        step["durationMs"] = duration
    
    return {"step": step, "category": "HTTP Headers & Technology", "items": items}


# ── 4. Website Content Crawl ──────────────────────────────

def crawl_website(domain: str) -> dict:
    """
    Real HTML crawl of the target website.
    Extracts title, meta tags, Open Graph data, social links, and page structure.
    Source: Live GET request + BeautifulSoup HTML parsing.
    """
    step = {
        "id": "crawl",
        "agentId": 2,
        "agentName": "Website Monitor",
        "description": f"Crawling {domain} — extracting page structure, meta tags & content",
        "sourceUrl": f"https://{domain}",
        "status": "running",
    }
    start = time.time()
    items = []
    
    try:
        headers = {"User-Agent": USER_AGENT}
        resp = requests.get(f"https://{domain}", headers=headers, timeout=REQUESTS_TIMEOUT, allow_redirects=True)
        soup = BeautifulSoup(resp.text, "lxml")
        
        # Page title
        title_tag = soup.find("title")
        if title_tag and title_tag.string:
            items.append({
                "label": "Page Title",
                "value": title_tag.string.strip()[:150],
                "source": f"<title> tag from {domain}",
                "sourceUrl": f"https://{domain}",
                "confidence": 100
            })
        
        # Meta description
        meta_desc = soup.find("meta", attrs={"name": "description"})
        if meta_desc and meta_desc.get("content"):
            items.append({
                "label": "Meta Description",
                "value": meta_desc["content"].strip()[:200],
                "source": f"<meta name='description'> from {domain}",
                "sourceUrl": f"https://{domain}",
                "confidence": 100
            })
        
        # Open Graph tags
        for og_prop in ["og:title", "og:description", "og:type", "og:image", "og:site_name"]:
            og_tag = soup.find("meta", attrs={"property": og_prop})
            if og_tag and og_tag.get("content"):
                label = og_prop.replace("og:", "OG ").title()
                items.append({
                    "label": label,
                    "value": og_tag["content"].strip()[:200],
                    "source": f"Open Graph <meta property='{og_prop}'> from {domain}",
                    "sourceUrl": f"https://{domain}",
                    "confidence": 100
                })
        
        # Social links
        social_platforms = {
            "twitter.com": "Twitter/X", "x.com": "Twitter/X",
            "linkedin.com": "LinkedIn", "facebook.com": "Facebook",
            "github.com": "GitHub", "instagram.com": "Instagram",
            "youtube.com": "YouTube", "tiktok.com": "TikTok"
        }
        found_socials = set()
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"].lower()
            for platform_domain, platform_name in social_platforms.items():
                if platform_domain in href and platform_name not in found_socials:
                    found_socials.add(platform_name)
                    items.append({
                        "label": f"{platform_name} Profile",
                        "value": a_tag["href"][:150],
                        "source": f"Link found on {domain} homepage",
                        "sourceUrl": a_tag["href"] if a_tag["href"].startswith("http") else f"https://{domain}",
                        "confidence": 95
                    })
        
        # Detect embedded scripts/tools
        page_text = resp.text.lower()
        tech_detections = {
            "google-analytics.com": ("Google Analytics", 90),
            "gtag": ("Google Tag Manager", 85),
            "hotjar.com": ("Hotjar", 90),
            "hubspot.com": ("HubSpot", 88),
            "intercom.io": ("Intercom", 90),
            "segment.com": ("Segment", 85),
            "stripe.com": ("Stripe", 80),
            "sentry.io": ("Sentry Error Tracking", 85),
            "zendesk.com": ("Zendesk", 88),
            "drift.com": ("Drift Chat", 85),
            "crisp.chat": ("Crisp Chat", 85),
            "calendly.com": ("Calendly", 88),
            "typeform.com": ("Typeform", 85),
            "mixpanel.com": ("Mixpanel", 85),
            "amplitude.com": ("Amplitude", 85),
            "clearbit.com": ("Clearbit", 80),
            "facebook.net/en_US/fbevents": ("Facebook Pixel", 90),
            "snap.licdn.com": ("LinkedIn Insight Tag", 88),
            "cloudflareinsights": ("Cloudflare Web Analytics", 90),
            "recaptcha": ("Google reCAPTCHA", 92),
        }
        for signature, (tool_name, conf) in tech_detections.items():
            if signature in page_text:
                items.append({
                    "label": f"Detected: {tool_name}",
                    "value": "Script/embed found in page source",
                    "source": f"JavaScript signature scan on {domain}",
                    "sourceUrl": f"https://{domain}",
                    "confidence": conf
                })

        # Count key page elements
        h1_tags = soup.find_all("h1")
        all_links = soup.find_all("a", href=True)
        all_images = soup.find_all("img")
        items.append({
            "label": "Page Structure",
            "value": f"{len(h1_tags)} H1 tags, {len(all_links)} links, {len(all_images)} images",
            "source": f"HTML DOM analysis of {domain}",
            "sourceUrl": f"https://{domain}",
            "confidence": 100
        })

        duration = int((time.time() - start) * 1000)
        step["status"] = "done"
        step["result"] = f"Extracted {len(items)} data points from live HTML"
        step["dataPoints"] = len(items)
        step["durationMs"] = duration
        
    except Exception as e:
        duration = int((time.time() - start) * 1000)
        step["status"] = "error"
        step["result"] = f"Website crawl failed: {str(e)[:100]}"
        step["durationMs"] = duration
    
    return {"step": step, "category": "Website Content & Technology", "items": items}


# ── 5. SSL Certificate ────────────────────────────────────

def check_ssl(domain: str) -> dict:
    """
    Real TLS handshake to inspect the SSL certificate.
    Source: Direct socket connection + Python ssl module.
    """
    step = {
        "id": "ssl",
        "agentId": 8,
        "agentName": "Tech Detection",
        "description": f"SSL/TLS certificate inspection for {domain}",
        "sourceUrl": f"https://www.ssllabs.com/ssltest/analyze.html?d={domain}",
        "status": "running",
    }
    start = time.time()
    items = []
    
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:
            s.settimeout(REQUESTS_TIMEOUT)
            s.connect((domain, 443))
            cert = s.getpeercert()
        
        # Issuer
        issuer_parts = dict(x[0] for x in cert.get("issuer", []))
        issuer_org = issuer_parts.get("organizationName", "Unknown")
        issuer_cn = issuer_parts.get("commonName", "")
        items.append({
            "label": "SSL Issuer",
            "value": f"{issuer_org} ({issuer_cn})" if issuer_cn else issuer_org,
            "source": "TLS certificate handshake",
            "sourceUrl": f"https://www.ssllabs.com/ssltest/analyze.html?d={domain}",
            "confidence": 100
        })
        
        # Subject
        subject_parts = dict(x[0] for x in cert.get("subject", []))
        subject_cn = subject_parts.get("commonName", "")
        if subject_cn:
            items.append({
                "label": "Certificate Subject",
                "value": subject_cn,
                "source": "TLS certificate handshake",
                "sourceUrl": f"https://www.ssllabs.com/ssltest/analyze.html?d={domain}",
                "confidence": 100
            })
        
        # Validity
        not_after = cert.get("notAfter", "")
        not_before = cert.get("notBefore", "")
        if not_after:
            items.append({
                "label": "Certificate Expires",
                "value": not_after,
                "source": "TLS certificate handshake",
                "sourceUrl": f"https://www.ssllabs.com/ssltest/analyze.html?d={domain}",
                "confidence": 100
            })
        if not_before:
            items.append({
                "label": "Certificate Issued",
                "value": not_before,
                "source": "TLS certificate handshake",
                "sourceUrl": f"https://www.ssllabs.com/ssltest/analyze.html?d={domain}",
                "confidence": 100
            })
        
        # SAN (Subject Alternative Names)
        san_list = cert.get("subjectAltName", [])
        if san_list:
            san_domains = [v for _, v in san_list[:10]]
            items.append({
                "label": "Covered Domains (SAN)",
                "value": ", ".join(san_domains),
                "source": "TLS certificate subjectAltName",
                "sourceUrl": f"https://www.ssllabs.com/ssltest/analyze.html?d={domain}",
                "confidence": 100
            })
        
        # Protocol version
        items.append({
            "label": "TLS Protocol",
            "value": s.version() if hasattr(s, 'version') else "TLS 1.2+",
            "source": "TLS handshake negotiation",
            "sourceUrl": f"https://www.ssllabs.com/ssltest/analyze.html?d={domain}",
            "confidence": 100
        })
        
        duration = int((time.time() - start) * 1000)
        step["status"] = "done"
        step["result"] = f"Inspected {len(items)} certificate fields"
        step["dataPoints"] = len(items)
        step["durationMs"] = duration
        
    except Exception as e:
        duration = int((time.time() - start) * 1000)
        step["status"] = "error"
        step["result"] = f"SSL check failed: {str(e)[:100]}"
        step["durationMs"] = duration
    
    return {"step": step, "category": "SSL / TLS Certificate", "items": items}


# ── 6. HackerNews Search ──────────────────────────────────

def search_hackernews(query: str) -> dict:
    """
    Real search against HackerNews Algolia API (completely free, no key).
    Source: https://hn.algolia.com/api
    """
    step = {
        "id": "hackernews",
        "agentId": 6,
        "agentName": "Public Conversation",
        "description": f"Searching HackerNews for mentions of '{query}'",
        "sourceUrl": f"https://hn.algolia.com/?q={query}",
        "status": "running",
    }
    start = time.time()
    items = []
    
    try:
        url = f"https://hn.algolia.com/api/v1/search?query={query}&tags=story&hitsPerPage=10"
        resp = requests.get(url, timeout=REQUESTS_TIMEOUT)
        data = resp.json()
        
        total_hits = data.get("nbHits", 0)
        stories = data.get("hits", [])
        
        items.append({
            "label": "Total HN Mentions",
            "value": f"{total_hits} stories found",
            "source": "HackerNews Algolia API",
            "sourceUrl": f"https://hn.algolia.com/?q={query}",
            "confidence": 95
        })
        
        for story in stories[:5]:
            title = story.get("title", "Untitled")
            points = story.get("points", 0)
            num_comments = story.get("num_comments", 0)
            object_id = story.get("objectID", "")
            created = story.get("created_at", "")[:10]
            
            items.append({
                "label": f"HN Story ({created})",
                "value": f"{title} — {points} pts, {num_comments} comments",
                "source": "HackerNews",
                "sourceUrl": f"https://news.ycombinator.com/item?id={object_id}",
                "confidence": 100
            })
        
        duration = int((time.time() - start) * 1000)
        step["status"] = "done"
        step["result"] = f"Found {total_hits} HN stories, showing top {min(5, len(stories))}"
        step["dataPoints"] = len(items)
        step["durationMs"] = duration
        
    except Exception as e:
        duration = int((time.time() - start) * 1000)
        step["status"] = "error"
        step["result"] = f"HN search failed: {str(e)[:100]}"
        step["durationMs"] = duration
    
    return {"step": step, "category": "HackerNews Mentions", "items": items}


# ── Master Research Pipeline ──────────────────────────────

def run_full_research(query: str) -> dict:
    """
    Runs all research functions concurrently and aggregates results.
    Returns only REAL data. No fabrication.
    """
    domain = _normalize_domain(query)
    
    results = {
        "query": query,
        "domain": domain,
        "timestamp": datetime.utcnow().isoformat(),
        "steps": [],
        "sections": [],
        "totalDataPoints": 0,
        "errors": []
    }
    
    # Run all lookups concurrently for speed
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {
            executor.submit(lookup_whois, domain): "whois",
            executor.submit(lookup_dns, domain): "dns",
            executor.submit(detect_tech_from_headers, domain): "tech",
            executor.submit(crawl_website, domain): "crawl",
            executor.submit(check_ssl, domain): "ssl",
            executor.submit(search_hackernews, query): "hn",
        }
        
        for future in as_completed(futures):
            label = futures[future]
            try:
                result = future.result()
                results["steps"].append(result["step"])
                if result["items"]:
                    results["sections"].append({
                        "category": result["category"],
                        "items": result["items"]
                    })
                    results["totalDataPoints"] += len(result["items"])
                elif result["step"]["status"] == "error":
                    results["errors"].append(result["step"]["result"])
            except Exception as e:
                results["errors"].append(f"{label}: {str(e)[:100]}")
    
    # Sort steps by agentId for consistent display
    results["steps"].sort(key=lambda s: s["agentId"])
    
    # Add a note about paid sources
    results["sections"].append({
        "category": "Requires API Key (Not Available)",
        "items": [
            {"label": "LinkedIn Company Data", "value": "Requires Proxycurl or LinkedIn API key — configure in Settings", "source": "Not connected", "sourceUrl": "", "confidence": 0},
            {"label": "Crunchbase Funding", "value": "Requires Crunchbase API key — configure in Settings", "source": "Not connected", "sourceUrl": "", "confidence": 0},
            {"label": "G2 / Capterra Reviews", "value": "Requires paid scraping API — configure in Settings", "source": "Not connected", "sourceUrl": "", "confidence": 0},
            {"label": "SimilarWeb Traffic", "value": "Requires SimilarWeb API key ($500+/mo) — configure in Settings", "source": "Not connected", "sourceUrl": "", "confidence": 0},
        ]
    })
    
    return results
