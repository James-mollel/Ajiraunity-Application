from Jobs.models import Job
from django.utils import timezone
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Automatically closes jobs where deadline has passed"

    def handle(self, *args, **options):
        today = timezone.now().date()

        expired_jobs = Job.objects.filter(
            status = Job.JobStatus.ACTIVE,
            deadline__lt =today,
            deadline__isnull = False,
        )

        count = expired_jobs.count()
        if count > 0:
            expired_jobs.update(status = Job.JobStatus.CLOSED, updated_at = timezone.now())

            self.stdout.write(
                self.style.SUCCESS(f"Successfully closed {count} expired jobs")
                 )
        else:
            self.stdout.write(
                self.style.WARNING("No expired job found")
            )