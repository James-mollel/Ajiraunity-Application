from django.db import models
from Users.models import CustomUserModel, UsersProfile
from Jobs.models import Job
from django.db import transaction
from uuid6 import uuid7
from cloudinary.models import CloudinaryField

# Create your models here.
 
 
class JobApplication(models.Model):
    class JobStatus(models.TextChoices):
        PENDING = "PENDING","Pending"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        SHORTLISTED = "SHORTLISTED","Shortlisted"
        INTERVIEW = "INTERVIEW","Interview Stage"
        HIRED = "HIRED","Hired"
        REJECTED = "REJECTED","Rejected"
     
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applied_job')
    user = models.ForeignKey(UsersProfile, on_delete=models.CASCADE, related_name='job_applier')
    application_method = models.CharField(max_length=30, choices=[
                                     ("IN_PLATFORM","Applied on this platform"),
                                     ("WEBSITE","Applied via company website"),
                                     ("EMAIL","Applied via email"),
                                     ("WHATSAPP","Applied via WhatsApp"),
                                     ])

    cv = CloudinaryField('file',blank=True, null=True)
    cover_letter = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=22, choices=JobStatus.choices,
                               default=JobStatus.PENDING)
    
    applied_at = models.DateTimeField(auto_now_add=True)

    
    

    class Meta:
        unique_together = ("job","user")

    def save(self, *args, **kwargs):
        is_new_application = self._state.adding
        super().save(*args, **kwargs)

        if is_new_application:
            with transaction.atomic():
                from django.db.models import F
                Job.objects.filter(id = self.job_id).update(applied = F("applied") + 1)
                
        

    
    def __str__(self):
        return f"{self.job.title}-{self.user}"
    
    

class SavedJobs(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    user = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='saved_by')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_job')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user","job")

    def __str__(self):
        return f"{self.user}-{self.job.title}"
    


class ReportedJob(models.Model):
    class Reason(models.TextChoices):
        FAKE = "FAKE","Fake Job"
        SPAM = "SPAM",'Spam'
        INAPPROPRIATE = "INAPPROPRIATE", "Inappropriate"
        EXPIRED = "EXPIRED", "Expired"
        OTHER = "OTHER", "Other"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='repored_job')
    job_reporter = models.ForeignKey(CustomUserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_reporter')
    reason = models.CharField(max_length=20, choices=Reason.choices)
    description = models.TextField(blank=True)
    is_resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("job","job_reporter")

    def __str__(self):
        return f"Report on {self.job.title[:10]}.. - {self.reason[:8]}..."
    

# #Conversations 
# class Conversation(models.Model):
#     id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
#     job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True, related_name='conversations')
#     participants = models.ManyToManyField(CustomUserModel, related_name='conversations')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"Chat : {self.job.title if self.job else 'Direct'}"
#     def other_person(self, user):
#         return self.participants.exclude(id=user.id).first()
    
# class Message(models.Model):
#     id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
#     conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
#     sender = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name="sent_message")
#     text = models.TextField()
#     is_read = models.BooleanField(default=False)
#     sent_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.sender}-{self.conversation}"