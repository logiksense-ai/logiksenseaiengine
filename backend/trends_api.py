import time
from pytrends.request import TrendReq
import pandas as pd

def get_live_search_trends():
    """
    Fetches real-time search trends from Google using pytrends.
    Returns a list of dictionaries matching the SearchIntentTrend frontend interface.
    """
    # Keywords based on the ICP/mock data to start with
    keywords = [
        "bookkeeping software",
        "ERP migration"
    ]
    
    # Map keywords to full display name and category for frontend
    meta_info = {
        "bookkeeping software": {
            "keyword_display": "AI bookkeeping software",
            "category": "Accounting / SMB",
            "region": "Global"
        },
        "ERP migration": {
            "keyword_display": "Cloud ERP migration",
            "category": "Enterprise Technology",
            "region": "Global"
        }
    }
    
    results = []
    
    try:
        # Initialize pytrends
        pytrend = TrendReq(hl='en-US', tz=360)
        
        # Build payload for the last 30 days
        pytrend.build_payload(kw_list=keywords, timeframe='today 1-m', geo='')
        
        # Get interest over time
        interest_over_time_df = pytrend.interest_over_time()
        
        if not interest_over_time_df.empty:
            for kw in keywords:
                # We calculate a simple growth percentage by comparing the first half of the month to the second half
                series = interest_over_time_df[kw]
                midpoint = len(series) // 2
                first_half_avg = series.iloc[:midpoint].mean()
                second_half_avg = series.iloc[midpoint:].mean()
                
                growth = 0
                if first_half_avg > 0:
                    growth = int(((second_half_avg - first_half_avg) / first_half_avg) * 100)
                
                # Mock a monthly volume based on recent average interest level
                # Google Trends returns 0-100 relative index, we multiply to get a simulated absolute volume
                avg_interest = series.mean()
                monthly_volume = int(avg_interest * 500) 
                
                info = meta_info[kw]
                
                results.append({
                    "keyword": info["keyword_display"],
                    "category": info["category"],
                    "growthPercentage": growth if growth > 0 else abs(growth), # absolute value for demo display
                    "region": info["region"],
                    "monthlyVolume": monthly_volume
                })
        else:
            # Fallback if dataframe is empty
            raise Exception("Empty dataframe returned by pytrends")
            
    except Exception as e:
        print(f"Error fetching Google Trends: {e}")
        # Return fallback data if rate limited or error
        results = [
            {
                "keyword": "AI bookkeeping software (Fallback)",
                "category": "Accounting / SMB",
                "growthPercentage": 12,
                "region": "Global",
                "monthlyVolume": 5000
            },
            {
                "keyword": "Cloud ERP migration (Fallback)",
                "category": "Enterprise Technology",
                "growthPercentage": 8,
                "region": "Global",
                "monthlyVolume": 4000
            }
        ]
        
    return results
