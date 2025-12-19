import csv
from django.core.management.base import BaseCommand
from django.db import transaction
import os
from ...models import Region, Ward, District

class Command(BaseCommand):
    help = "Import regions  district and wards from .csv csv columns regions,districs, wards"

    def add_arguments(self, parser):
        parser.add_argument("path", type=str, help="path to csv file")
    
    def handle(self, *args, **options):
        path = options["path"]
        self.stdout.write(self.style.SUCCESS(f"Reading from: {path}"))

        if os.path.isdir(path):
            csv_files = [os.path.join(path, f) for f in os.listdir(path) if f.endswith(".csv") ]
            self.stdout.write(self.style.SUCCESS(f"Found: {len(csv_files)} CSV files in folder."))
        elif os.path.isfile(path) and path.endswith(".csv"):
            csv_files = [path]
        else:
            self.stdout.write(self.style.ERROR("Invalid path provide a csv file or folder with csv"))
            return
        
        total_rows = 0
        for csv_file in csv_files:
            self.stdout.write(self.style.HTTP_INFO(f"Importing: {os.path.basename(csv_file)}"))
            total_rows += self.import_csv(csv_file)
        
        self.stdout.write(self.style.SUCCESS(f"Import completed! Total rows processed: {total_rows}"))

    def import_csv(self, csv_file):
            count = 0
            with open(csv_file, newline='', encoding='utf-8') as fh, transaction.atomic():
                reader = csv.DictReader(fh) 
               

                for row in reader:

                    row = {k.lower(): v for k,v in row.items()}
                    region_name = row.get("region").strip().title() if row.get('region') else None
                    district_name = row.get("district").strip().title() if row.get("district") else None
                    ward_name = row.get("ward").strip().title() if row.get("ward") else None

                    if not (region_name and district_name and ward_name):
                        continue


                    region, r_created = Region.objects.get_or_create(name = region_name)
                    
                    district, d_created = District.objects.get_or_create(region=region,name = district_name)
                   
                    Ward.objects.get_or_create(district=district,name=ward_name)
                   

                    count = count +1
                    if count % 1000 == 0:
                        self.stdout.write(f"  Processed {count} rows. in {os.path.basename(csv_file)}...")
            self.stdout.write(self.style.SUCCESS(f"Imported success ({count} .rows) from {os.path.basename(csv_file)} "))
            return count