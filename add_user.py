from google_auth_oauthlib.flow import InstalledAppFlow
import requests

SCOPES = ['https://www.googleapis.com/auth/analytics.manage.users']

flow = InstalledAppFlow.from_client_secrets_file(
    'oauth_client.json',  # path to the file you just downloaded
    SCOPES
)

creds = flow.run_local_server(port=0)

response = requests.post(
    "https://analyticsadmin.googleapis.com/v1alpha/properties/529091678/accessBindings",
    headers={"Authorization": f"Bearer {creds.token}"},
    json={
        "user": "ce-649@curated-experiences.iam.gserviceaccount.com",
        "roles": ["predefinedRoles/viewer"]
    }
)

print(response.status_code)
print(response.json())