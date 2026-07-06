const crypto = require('crypto');

function decrypt(encryptedText) {
    const key = Buffer.from("dGVzdC12YXVsdC1rZXktZm9yLWNpLTMyYnl0ZXM=", 'base64');
    const [ivHex, tagHex, authData] = encryptedText.split('.');
    
    const iv = Buffer.from(ivHex, 'base64');
    const tag = Buffer.from(tagHex, 'base64');
    const encrypted = Buffer.from(authData, 'base64');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'binary', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const dbRefreshToken = "swZGFeYCA3YmGORN.beb44UJ4RnKPusg95e0eng==.swONGVo4+gONrpwqWAh8C48A2jH5A5zuunusLiQhZ4c9o627uTUB/U4u0DTRZSDP/DKdhUwD0Hn7u1sQXiWnSriDYwf1ZmLUU5REp1VWmbvE/nc6Wu+4v3Kn+fWI09KFN1lNQwzRCag166/oR4XboKTFl8EVWQI2/cG/w087SIWR5Ry0x5Ft6j3U22kOpf1iPE0x9BBui+hI+xj3ZCxKr1HrmSfN3CvEnSR3YczglzptN5k1ij1g8mjCLpCWi/2zfGfWOIIQsW5b4Xs1T18r+oEiZNNXL1YQCm1ic5o2znefh0BujXud/TBIt8YdXd6HBZjOjWOu/purHa6Dm0ed/e8g9TH+rV4z7UUBTeWnfQ4QXnFsT/aeHDHfHJuATC9UuwWdXr4Z2uYI4GWjravTpCtN9XTBEBDPISVaIax37MYhghphJbWMjffXxyIFqnFnh92n39pSljnWINrSs/e+FtexiF/xfqd580iDuvwPXBY0FxXlxRsTCjt3HOsKgPyh+VEHn52mCykbDZG4pN2yL0WZ4bPvULkaUtEbqKySAuFFpzr0aTVaC12H2W3xu9d5HOeofhhMtJ3mB8oZJSuZN0rLqz6LlQjCiu4Rtz1gmYgqfPVAHZl5l4Q5VRw0rjxw4MaiKKt1m6rZmJ7Tyy7qvqPxtTRmlvrmbEedLDzH/N0JOILcPgVVwVeaPNV5haZtyEhm6m2STdoh5jyPC5hlN+Ulhc5WcDvVTEvxicP5l4JQaNEuvyOMn6ufMw5TXvBRemEcNYJgC2DlYEo9R+Yd+jsWFYUHW7uQf+7QbmNF8sGuPTtogZGAhxIxPM4jhEsQ4PxOKuXOMmj8jUMlLreOLuxZYxzt7gaqNvVo/grThu8vDn0JK9RY+efzpPby3Xz48an0+o7R0/0dU6UHMIkKOjOyNZKuXk6PCLKeTB8v1t5oaGalsd+nUQi9yKG3E7LJnUHw8hiSUqDkLjxpuNa96xWerwMplr3D7oRVmTiGxPHKccGIciX9bIqq1ta4tgY/dUkDpp6vrqoyO7ndeaUJRaeGkuPxcV29ifkx+HaOlpFsRK7zUd8xBsk54TSm7fE6cbvvTx+WHTu9qA4d/QXt2waRy/BSOssBUbG+2+UqGQlb5j6MWpBm7SaYrDvZHW5/dE/X3glplR6h9Ff+ofYp6u4sM2E47ipoIkx2PAgiHBMyjQkpDVOBtGopwP2cfZcx4fFi0X0zL5JAA7Wi2a0TQK0kK473BJ5r/72OfNDqZb8WA0HW5EOVM17xNOPcnV1cFZmrAMDHuh//ldUc85z9xvTKvLc469R6NJrAXvQwHBrUSsb4yoLes+QLvLhdu/4kl3T3QFkHxByBEDhHiFdsywHa3JwGa9vPYSU4+3khHKKw6ijkqsGa757ofLObTju6BC7WEz7M+q9a1EciAgK9GrPfLXHm0wxU9wa0D48kfWD0ArisT5AItYOZAjUIrPz4fI1qOM4HIgsJty+Bj1BLHa1m4DLwz2Q5Ra5/lMVbO/38w0zGTQUdbQXnkN2H3sRRPwkugtyK22oX0uppan4/ChVi8ncpiqA6SmkXfCroBxQoNAotQhu954o8GsF9YAJ7RscLLU+p1BTlXgop+D8yktU251iuzkrxD/uurKuflt1xittDI4rE4i2QQw12iTaFjzd1x10F5NP+LR2nMcDbT4TGK8GjmjOi62BVWPalIXGVN4ToKj55V2zO9VAW1NiTZBqPqBBCizDHG1t1v4ean2gi3EfviCrGaxieVrE2sBBKPUICwNsIkB1tPiCq7nmH0oQw8ez6ukbsoUw1YRfaNCe+iHHpK+7RC5BQHABFn5sV7cOi3cvHO56FGFMcEGACjtiXsUPSVLVccmrGYRMg873aqOrRBd9L3HO1wvyEaFunWbND8cTPxundwS/RqOJb9uK6NDg67Q==";
console.log(decrypt(dbRefreshToken));
