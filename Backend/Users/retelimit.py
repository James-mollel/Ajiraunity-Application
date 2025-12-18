from django.core.cache import cache
from functools import wraps
from rest_framework.response import Response
from rest_framework import status
import logging
from hashlib import md5

logger = logging.getLogger(__name__)

def ratelimit (limit=5, window=600, block_time=900, key_prefix='ratelimit'):
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(self, request, *args, **kwargs):

            x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            client_ip = x_forwarded_for.split(',')[0].strip() if x_forwarded_for else request.META.get("REMOTE_ADDR")
            email = (request.data.get("email") or "").strip().lower()

            # create variable for the catche
            ip_key = f"{key_prefix}_ip_{client_ip}"
            email_key = f"{key_prefix}_email_{email}" if email else None
            blocked_ip_key = f"{key_prefix}_blocked_ip_{client_ip}"
            blocked_email_key = f"{key_prefix}_blocked_email_{email}" if email else None

            if cache.get(blocked_ip_key):
                logger.warning(f"Blocked ip {client_ip} tried access {key_prefix}")
                return Response({'detail':"You're sending too many requests. Please try again later"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
            if(cache.get(blocked_email_key) and email):
                logger.warning(f"Blocked email {email} try access {key_prefix}")
                return Response({'detail':"You're sending too many requests. Please try again later"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
            # count 
            ip_attempts = int(cache.get(ip_key, 0)) +1
            cache.set(ip_key, ip_attempts, timeout=window)

            if (email):
                email_attempts = int(cache.get(email_key, 0)) +1
                cache.set(email_key,email_attempts,timeout=window)
            else:
                email_attempts = 0

            if (ip_attempts > limit):
                cache.set(blocked_ip_key, True, timeout=block_time)
                logger.warning(f"Ip {client_ip} Blocked for {block_time} too many attempts")
                return Response({'detail':"You're sending too many requests. Please try again later"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
            if(email and email_attempts> limit):
                cache.set(blocked_email_key, True, timeout=block_time)
                logger.warning(f"Email {email} blocked for {block_time} too many attempts")
                return Response({'detail':"You're sending too many requests. Please try again later"}, status= status.HTTP_429_TOO_MANY_REQUESTS)
            
            return view_func(self,request, *args, **kwargs)
        return wrapped_view
    return decorator