"""
Token service for email verification and password reset tokens.
Provides secure token generation and validation.
"""

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings
from django.core.cache import cache
import secrets
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    """
    Generate and verify email verification tokens.
    Extends Django's PasswordResetTokenGenerator for security.
    """
    
    def _make_hash_value(self, user, timestamp):
        """
        Hash value for email verification tokens.
        Includes user's email to invalidate token if email changes.
        """
        return f"{user.pk}{user.email}{timestamp}{user.is_verified}"


class TokenService:
    """Service for managing verification and password reset tokens."""
    
    EMAIL_VERIFICATION_PREFIX = 'email_verify_'
    PASSWORD_RESET_PREFIX = 'password_reset_'
    
    _instance = None  # Singleton instance
    
    def __new__(cls):
        """Implement singleton pattern."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize token service with lazy Django settings loading."""
        if self._initialized:
            return
        
        self.email_token_generator = EmailVerificationTokenGenerator()
        self.password_token_generator = PasswordResetTokenGenerator()
        self._verification_timeout = None
        self._initialized = True
    
    @property
    def verification_timeout(self):
        """Lazy load verification timeout from settings."""
        if self._verification_timeout is None:
            self._verification_timeout = getattr(
                settings,
                'EMAIL_VERIFICATION_TIMEOUT',
                24  # hours, default
            )
        return self._verification_timeout
    
    def generate_email_verification_token(self, user):
        """
        Generate a secure email verification token for a user.
        
        Args:
            user (CustomUser): The user object
        
        Returns:
            tuple[str, str]: Base64 user id and token
        """
        try:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = self.email_token_generator.make_token(user)
            
            # Store token in cache with expiration
            cache_key = f"{self.EMAIL_VERIFICATION_PREFIX}{user.id}"
            cache.set(cache_key, token, timeout=self.verification_timeout * 3600)

            logger.info(f"Email verification token generated for user {user.id}")
            return uid, token
        except Exception as e:
            logger.error(f"Error generating email verification token: {str(e)}")
            return None
    
    def verify_email_verification_token(self, user, uidb64, token=None):
        """
        Verify an email verification token.
        
        Args:
            user (CustomUser): The user object
            uidb64 (str): Base64-encoded user id
            token (str): Token string
        
        Returns:
            bool: True if token is valid, False otherwise
        """
        try:
            # Decode the user ID
            try:
                decoded_uid = force_str(urlsafe_base64_decode(uidb64))
                user_id = int(decoded_uid)
            except (ValueError, TypeError):
                logger.warning(f"Invalid user ID in token for user {user.id}")
                return False
            
            # Verify user ID matches
            if user_id != user.id:
                logger.warning(f"User ID mismatch: {user_id} != {user.id}")
                return False
            
            # Check if token is in cache (not expired)
            cache_key = f"{self.EMAIL_VERIFICATION_PREFIX}{user.id}"
            cached_token = cache.get(cache_key)
            
            if not cached_token:
                logger.warning(f"Token expired or not found in cache for user {user.id}")
                return False
            
            # Verify token matches
            if token != cached_token:
                logger.warning(f"Token mismatch for user {user.id}")
                return False
            
            # Verify token signature
            if not self.email_token_generator.check_token(user, token):
                logger.warning(f"Invalid token signature for user {user.id}")
                return False
            
            logger.info(f"Email verification token verified for user {user.id}")
            return True
        
        except Exception as e:
            logger.error(f"Error verifying email token: {str(e)}")
            return False
    
    def invalidate_email_verification_token(self, user):
        """
        Invalidate an email verification token (remove from cache).
        
        Args:
            user (CustomUser): The user object
        """
        try:
            cache_key = f"{self.EMAIL_VERIFICATION_PREFIX}{user.id}"
            cache.delete(cache_key)
            logger.info(f"Email verification token invalidated for user {user.id}")
        except Exception as e:
            logger.error(f"Error invalidating email token: {str(e)}")
    
    def generate_password_reset_token(self, user):
        """
        Generate a secure password reset token for a user.
        
        Args:
            user (CustomUser): The user object
        
        Returns:
            tuple[str, str]: Base64 user id and token
        """
        try:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = self.password_token_generator.make_token(user)
            
            # Store token in cache with 1 hour expiration for password reset
            cache_key = f"{self.PASSWORD_RESET_PREFIX}{user.id}"
            cache.set(cache_key, token, timeout=3600)  # 1 hour

            logger.info(f"Password reset token generated for user {user.id}")
            return uid, token
        except Exception as e:
            logger.error(f"Error generating password reset token: {str(e)}")
            return None
   
    def verify_password_reset_token(self, user, uidb64, token=None):
        """
        Verify a password reset token.
        
        Args:
            user (CustomUser): The user object
            uidb64 (str): Base64-encoded user id
            token (str): Token string
        
        Returns:
            bool: True if token is valid, False otherwise
        """
        try:
            # Decode the user ID
            try:
                decoded_uid = force_str(urlsafe_base64_decode(uidb64))
                user_id = int(decoded_uid)
            except (ValueError, TypeError):
                logger.warning(f"Invalid user ID in password reset token")
                return False
            
            # Verify user ID matches
            if user_id != user.id:
                logger.warning(f"User ID mismatch in password reset token")
                return False
            
            # Check if token is in cache (not expired)
            cache_key = f"{self.PASSWORD_RESET_PREFIX}{user.id}"
            cached_token = cache.get(cache_key)
            
            if not cached_token:
                logger.warning(f"Password reset token expired or not found")
                return False
            
            # Verify token matches
            if token != cached_token:
                logger.warning(f"Password reset token mismatch")
                return False
            
            # Verify token signature
            if not self.password_token_generator.check_token(user, token):
                logger.warning(f"Invalid password reset token signature")
                return False
            
            logger.info(f"Password reset token verified for user {user.id}")
            return True
        
        except Exception as e:
            logger.error(f"Error verifying password reset token: {str(e)}")
            return False
    
    def invalidate_password_reset_token(self, user):
        """
        Invalidate a password reset token (remove from cache).
        
        Args:
            user (CustomUser): The user object
        """
        try:
            cache_key = f"{self.PASSWORD_RESET_PREFIX}{user.id}"
            cache.delete(cache_key)
            logger.info(f"Password reset token invalidated for user {user.id}")
        except Exception as e:
            logger.error(f"Error invalidating password reset token: {str(e)}")


# Global token service instance
token_service = TokenService()
