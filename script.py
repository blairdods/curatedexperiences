from google.analytics.admin import AnalyticsAdminServiceClient
from google.analytics.admin_v1alpha.types import AccessBinding
import google.auth

creds, project = google.auth.default()

client = AnalyticsAdminServiceClient(credentials=creds)

access_binding = AccessBinding(
    user="ce-649@curated-experiences.iam.gserviceaccount.com",
    roles=["predefinedRoles/viewer"]
)

result = client.create_access_binding(
    parent="properties/529091678",
    access_binding=access_binding
)

print("Success!", result)