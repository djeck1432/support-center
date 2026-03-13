"""Seed the database with 10 internet provider customer support scripts."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from database import async_session, init_db  # noqa: E402
from models import SupportScript  # noqa: E402

SCRIPTS = [
    {
        "category": "no_internet",
        "title": "No Internet Connection",
        "keywords": "no internet, not working, offline, can't connect, no connection, disconnected, down",
        "script_text": """GREETING:
"Thank you for calling NetConnect Support. I understand you're experiencing a complete loss of internet. Let me help you get back online right away."

DIAGNOSTIC QUESTIONS:
1. "Can you tell me — are any lights on your router/modem currently lit?"
2. "When did you first notice the connection was lost?"
3. "Has anything changed recently — a power outage, new equipment, or moved cables?"

TROUBLESHOOTING STEPS:
Step 1 — Power Cycle:
"Let's start with a full power cycle. Please unplug your modem and router from power, wait 30 seconds, then plug the modem back in first. Wait until all lights stabilize (about 2 minutes), then plug in the router."

Step 2 — Check Physical Connections:
"Please make sure the coaxial or ethernet cable running from the wall to your modem is firmly connected at both ends. Also verify the ethernet cable from your modem to your router is secure."

Step 3 — Check Device:
"Try connecting a device directly to the modem with an ethernet cable, bypassing the router. Does that device get internet?"

Step 4 — Modem Lights:
"Look at your modem — the 'Online' or 'Internet' light should be solid. If it's blinking or off, the issue is between your modem and our network."

ESCALATION:
"If the modem's online light is still not solid after the power cycle, there may be an outage in your area or a line issue. I'll check for outages and, if needed, schedule a technician visit within 24-48 hours at no charge."

CLOSING:
"Is there anything else I can help you with today? Thank you for choosing NetConnect."
""",
    },
    {
        "category": "slow_speed",
        "title": "Slow Internet Speed",
        "keywords": "slow, speed, buffering, lag, latency, bandwidth, throttle, sluggish",
        "script_text": """GREETING:
"Thank you for calling NetConnect Support. I'm sorry to hear your internet is running slowly. Let's figure out what's going on and get your speeds back up."

DIAGNOSTIC QUESTIONS:
1. "What speed plan are you subscribed to? (I can look this up for you.)"
2. "Are you experiencing slow speeds on all devices or just one?"
3. "Are you connected via WiFi or ethernet cable?"
4. "Is the slowness constant or does it happen at certain times of day?"

TROUBLESHOOTING STEPS:
Step 1 — Speed Test:
"Let's run a speed test. Please go to speedtest.net on your device and run the test. Can you tell me the download and upload speeds?"

Step 2 — WiFi vs Wired:
"If you're on WiFi, try connecting directly to your router with an ethernet cable and re-run the test. WiFi can reduce speeds by 30-50% depending on distance and interference."

Step 3 — Device Check:
"Close any background applications, streaming services, or downloads that may be using bandwidth. Also check if other household members are using heavy bandwidth activities."

Step 4 — Router Placement:
"Make sure your router is in a central location, elevated off the floor, and away from walls, microwaves, or cordless phones that can cause interference."

Step 5 — DNS Optimization:
"Let's try changing your DNS to Google's public DNS: 8.8.8.8 and 8.8.4.4. This can sometimes improve browsing speeds significantly."

ESCALATION:
"If wired speeds are significantly below your plan rate, I'll run a line quality test from our end. We may need to reprovision your modem or send a technician to check the signal levels."

CLOSING:
"Is there anything else I can help with? Thank you for being a NetConnect customer."
""",
    },
    {
        "category": "router_setup",
        "title": "Router/Modem Setup",
        "keywords": "setup, install, new router, new modem, configure, first time, installation",
        "script_text": """GREETING:
"Welcome to NetConnect Support! I'd be happy to help you set up your new equipment. Let's get you connected."

DIAGNOSTIC QUESTIONS:
1. "Is this a new installation or are you replacing existing equipment?"
2. "What model of router/modem did you receive?"
3. "Do you have the coaxial cable or fiber cable available?"

SETUP STEPS:
Step 1 — Physical Setup:
"Connect the coaxial cable (or ethernet from the wall port for fiber) to the 'Cable In' or 'WAN' port on your modem. Then connect a power cable and turn it on."

Step 2 — Wait for Activation:
"The modem will take 5-10 minutes to fully activate. You'll see the lights cycle through — wait until the 'Online' light is solid green."

Step 3 — Router Connection:
"If you have a separate router, connect an ethernet cable from the modem's 'LAN' or 'Ethernet' port to the router's 'WAN' or 'Internet' port. Power on the router."

Step 4 — WiFi Setup:
"Once the router is on, look for the default WiFi network name (SSID) and password on the sticker on the bottom of the router. Connect your device to that network."

Step 5 — Personalize:
"I recommend logging into your router's admin page (usually 192.168.1.1 or 192.168.0.1) to change the default WiFi name and password to something you'll remember. Use WPA3 or WPA2 for security."

Step 6 — Verify:
"Open a web browser and try loading a website to confirm your connection is working."

ESCALATION:
"If the modem doesn't activate within 15 minutes, I'll send an activation signal from our end. If that doesn't work, we may need to register your modem's MAC address on our system."

CLOSING:
"You're all set! Is there anything else I can help with today?"
""",
    },
    {
        "category": "wifi_issues",
        "title": "WiFi Connectivity Issues",
        "keywords": "wifi, wireless, dropping, disconnect, weak signal, can't find network, wifi not showing",
        "script_text": """GREETING:
"Thank you for calling NetConnect Support. I understand you're having WiFi issues. Let's troubleshoot and get your wireless connection stable."

DIAGNOSTIC QUESTIONS:
1. "Is the WiFi network visible on your device, or has it disappeared?"
2. "How far are you from the router when the issue occurs?"
3. "Does the problem affect all devices or just one?"
4. "When did this start happening?"

TROUBLESHOOTING STEPS:
Step 1 — Restart WiFi:
"On your device, turn WiFi off, wait 10 seconds, then turn it back on. Also try 'forgetting' the network and reconnecting with the password."

Step 2 — Router Restart:
"Unplug your router for 30 seconds, then plug it back in. Wait 2-3 minutes for it to fully boot."

Step 3 — Check Band:
"Your router likely broadcasts on 2.4GHz and 5GHz. The 5GHz band is faster but has shorter range. If you're far from the router, make sure you're on the 2.4GHz network."

Step 4 — Channel Congestion:
"WiFi interference from neighbors can cause drops. Log into your router admin (192.168.1.1) and try changing the WiFi channel — channels 1, 6, or 11 are best for 2.4GHz."

Step 5 — Range Solutions:
"If the issue is range-related, consider a WiFi extender or mesh system. Place your router centrally and elevated. Keep it away from thick walls, mirrors, and metal objects."

ESCALATION:
"If the router's WiFi keeps dropping despite these steps, the router's wireless radio may be failing. I can arrange a replacement router to be shipped within 2-3 business days."

CLOSING:
"Is your WiFi working better now? Is there anything else I can help with?"
""",
    },
    {
        "category": "billing",
        "title": "Billing Inquiry",
        "keywords": "bill, charge, payment, invoice, price, cost, overcharge, fees, balance, due",
        "script_text": """GREETING:
"Thank you for calling NetConnect Billing Support. I'd be happy to help you with your billing questions."

DIAGNOSTIC QUESTIONS:
1. "Can I have your account number or the phone number on the account?"
2. "Are you calling about a specific charge on your bill?"
3. "Would you like to review your full billing statement?"

COMMON SCENARIOS:

Scenario A — Explain Bill:
"Your current bill of $[amount] includes: monthly service at $[plan_price], equipment rental at $[rental], and any applicable taxes/fees. Would you like me to go through each line item?"

Scenario B — Unexpected Charge:
"I see a charge of $[amount] for [reason]. This was applied because [explanation]. If you believe this is incorrect, I can submit a dispute for review — you'll hear back within 5-7 business days."

Scenario C — Payment Options:
"You can pay via our website at netconnect.com/pay, through our mobile app, by calling our automated payment line, or by setting up AutoPay for a $5/month discount."

Scenario D — Late Payment:
"Your payment of $[amount] was due on [date]. A late fee of $10 has been applied. I can waive this as a one-time courtesy. Would you like me to do that?"

Scenario E — Payment Plan:
"If you're having difficulty paying the full balance, I can set up a payment arrangement splitting the balance into 2-3 installments."

ESCALATION:
"For complex billing disputes, I'll escalate this to our billing department who will review and contact you within 48 hours."

CLOSING:
"Is there anything else I can help you with regarding your account?"
""",
    },
    {
        "category": "plan_change",
        "title": "Plan Upgrade/Downgrade",
        "keywords": "upgrade, downgrade, change plan, faster, cheaper, switch, plan options, speed tier",
        "script_text": """GREETING:
"Thank you for calling NetConnect. I'd be happy to help you explore our plan options and make any changes to your service."

DIAGNOSTIC QUESTIONS:
1. "What plan are you currently on?"
2. "Are you looking for more speed, or to lower your monthly cost?"
3. "How many devices typically connect in your household?"

AVAILABLE PLANS:
- Basic 50: 50 Mbps download, $39.99/month — great for browsing and email
- Standard 200: 200 Mbps download, $59.99/month — streaming and moderate gaming
- Premium 500: 500 Mbps download, $79.99/month — multiple streamers, work from home
- Ultra 1000: 1 Gbps download, $99.99/month — heavy usage, large households

UPGRADE PROCESS:
"Great choice! I can upgrade you to [plan] right now. The new speed will take effect within 2 hours — your modem will reboot automatically. Your new monthly rate will be $[price], prorated for this billing cycle."

DOWNGRADE PROCESS:
"I can process the downgrade to [plan] for you. Please note: downgrades take effect at the start of your next billing cycle. Your new rate will be $[price]/month."

RETENTION (if downgrading or cancelling):
"Before we make that change, I'd like to mention that we have a loyalty offer available: [offer]. Would you like to hear more about that?"

ESCALATION:
"For custom business plans or bundle packages including TV and phone, I'll transfer you to our sales team who can create a tailored package."

CLOSING:
"Your plan change has been processed. Is there anything else I can help with?"
""",
    },
    {
        "category": "outage",
        "title": "Service Outage",
        "keywords": "outage, area outage, everyone down, neighborhood, service disruption, maintenance, widespread",
        "script_text": """GREETING:
"Thank you for calling NetConnect Support. Let me check if there's a service issue in your area."

DIAGNOSTIC QUESTIONS:
1. "Can I have your service address or ZIP code?"
2. "When did you first notice the outage?"
3. "Have your neighbors reported similar issues?"

CHECK PROCESS:
Step 1 — Outage Map:
"Let me check our system for known outages in your area... [checking]"

Step 2a — Outage Confirmed:
"I can confirm there is a known outage in your area affecting [X] customers. Our field team is actively working on it. The estimated resolution time is [time/date]. You'll receive a text notification when service is restored."

Step 2b — No Known Outage:
"I don't see a reported outage in your area. Let's troubleshoot your individual connection to see if the issue is specific to your location."

Step 3 — Report New Outage:
"I've created an outage report for your area. Our network operations team will investigate and dispatch a crew if needed. You should expect a status update within 2-4 hours."

PROACTIVE COMMUNICATION:
"Would you like to receive SMS or email updates about this outage? I can add you to the notification list."

ESCALATION:
"For outages lasting more than 24 hours, we automatically apply a service credit to affected accounts. If you'd like to request an additional credit, I can submit that for you."

CLOSING:
"I'm sorry for the inconvenience. We're working to restore service as quickly as possible. Is there anything else I can help with?"
""",
    },
    {
        "category": "new_connection",
        "title": "New Connection Setup",
        "keywords": "new service, sign up, new customer, get internet, start service, new account, move, moving",
        "script_text": """GREETING:
"Welcome to NetConnect! I'm excited to help you set up your new internet service. Let's get you connected."

INFORMATION GATHERING:
1. "What is the address where you'd like service installed?"
2. "Is this a residential or business address?"
3. "What is your preferred start date?"
4. "Will you need us to provide a router/modem, or do you have your own?"

SERVICE CHECK:
"Let me check service availability at your address... Great news! We offer service at your location with speeds up to [max_speed]."

PLAN RECOMMENDATION:
"Based on your needs, I'd recommend our [plan_name] plan at $[price]/month. This includes [speed] download speeds, which is perfect for [use_case]. We also have [alternative] if you'd prefer more/less speed."

INSTALLATION OPTIONS:
- Self-Install Kit: "We can mail a self-install kit (free) — most customers set it up in 15-20 minutes with our guide."
- Professional Install: "We can schedule a technician visit for $49.99 (waived on 12-month plans). Available slots: [dates]."

ACCOUNT SETUP:
"I'll need the following to set up your account: full name, email address, phone number, and a preferred payment method."

CONFIRMATION:
"Your installation is scheduled for [date]. You'll receive a confirmation email with all the details. Your first bill will be prorated from [start_date]."

CLOSING:
"Welcome to the NetConnect family! Is there anything else I can help with before we wrap up?"
""",
    },
    {
        "category": "cancel_service",
        "title": "Cancel Service",
        "keywords": "cancel, cancellation, disconnect, stop service, terminate, end service, close account",
        "script_text": """GREETING:
"Thank you for calling NetConnect. I'm sorry to hear you're considering cancellation. Before we proceed, may I understand what's prompting this decision?"

RETENTION QUESTIONS:
1. "Is there a specific issue we could resolve that would change your mind?"
2. "Are you moving to an area where we offer service? We can transfer your account."
3. "Would a different plan or price point work better for you?"

RETENTION OFFERS:
- Price Concern: "I can offer you a loyalty discount of $15/month for the next 12 months on your current plan."
- Speed Concern: "I can upgrade you to our next speed tier at no additional cost for 6 months."
- Moving: "We offer service in many areas! Let me check your new address."
- Competitor Offer: "Can you share the competitor's offer? I may be able to match or beat it."

CANCELLATION PROCESS (if customer insists):
Step 1: "I understand. Let me process that for you. Your service will remain active until [end_of_billing_cycle]."
Step 2: "Please return any rented equipment (modem/router) to your nearest NetConnect store within 30 days to avoid a $150 equipment fee."
Step 3: "Your final bill will be prorated. Any remaining balance will be charged to your payment method on file."
Step 4: "You'll receive a confirmation email with return instructions and your final bill details."

ESCALATION:
"If you'd like to speak with a retention specialist who may have additional offers, I can transfer you."

CLOSING:
"Your cancellation has been scheduled. We're sorry to see you go and hope to serve you again in the future. A confirmation email is on its way."
""",
    },
    {
        "category": "device_issues",
        "title": "Device-Specific Issues",
        "keywords": "smart tv, gaming console, xbox, playstation, printer, camera, iot, alexa, specific device, roku",
        "script_text": """GREETING:
"Thank you for calling NetConnect Support. I understand you're having trouble connecting a specific device to your internet. Let's get that sorted out."

DIAGNOSTIC QUESTIONS:
1. "What type of device are you trying to connect? (Smart TV, gaming console, printer, etc.)"
2. "Is the device new or was it previously connected and stopped working?"
3. "Can other devices connect to WiFi without issue?"
4. "What error message, if any, are you seeing on the device?"

TROUBLESHOOTING BY DEVICE TYPE:

Smart TV / Streaming Device:
"Go to your TV's network settings, select your WiFi network, and enter the password. If it won't connect, try: (1) restart the TV, (2) forget the network and reconnect, (3) make sure your TV's firmware is up to date."

Gaming Console (Xbox/PlayStation):
"Go to network settings, run a connection test. If NAT type shows as 'Strict', we need to enable UPnP on your router or set up port forwarding. Common ports: Xbox (3074), PlayStation (3478-3480)."

Smart Home / IoT Devices:
"Most smart home devices only work on 2.4GHz WiFi. Make sure you're connecting to the 2.4GHz network, not the 5GHz one. The device should be within range of your router."

Printer:
"For wireless printing, make sure the printer and your computer are on the same WiFi network. Run the printer's wireless setup wizard. If it's not finding the network, try connecting via WPS (push the WPS button on your router)."

ESCALATION:
"If the device still won't connect, the issue might be a compatibility problem or a device-side firmware bug. I recommend checking the device manufacturer's support page. If it's a router-side issue, I can help adjust settings."

CLOSING:
"Is your device connected now? Is there anything else I can help with today?"
""",
    },
]


async def seed() -> None:
    """Insert support scripts into the database if not already present."""
    await init_db()
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(SupportScript).limit(1))
        if result.scalar_one_or_none() is not None:
            print("Scripts already seeded — skipping.")
            return

        for data in SCRIPTS:
            session.add(SupportScript(**data))
        await session.commit()
        print(f"Seeded {len(SCRIPTS)} support scripts.")


if __name__ == "__main__":
    asyncio.run(seed())
