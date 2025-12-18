from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken,TokenError

class CustomJWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        
        header = self.get_header(request)
        if header is None:
            raw_token = request.COOKIES.get("__act") or None
        else:
            raw_token = self.get_raw_token(header)

        if  raw_token is None:
            return None
        
        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except (TokenError, InvalidToken ):
            return None