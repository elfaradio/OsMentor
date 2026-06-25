from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="""
A system has two processes:

P1 holds R1 and waits for R2.
P2 holds R2 and waits for R1.

Is this a deadlock?
Explain why in simple terms.
"""
)

print(response.text)