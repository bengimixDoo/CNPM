from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = "Reset auto-increment sequences (SQLite) to match current MAX(id) per table."

    def handle(self, *args, **options):
        engine = connection.settings_dict.get("ENGINE", "")
        if "sqlite" not in engine:
            self.stdout.write(self.style.WARNING("This command is intended for SQLite only. Skipping."))
            return

        with connection.cursor() as cursor:
            # Ensure sqlite_sequence exists
            cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence';"
            )
            if cursor.fetchone() is None:
                self.stdout.write(self.style.WARNING("No sqlite_sequence table found; nothing to reset."))
                return

            cursor.execute("SELECT name FROM sqlite_sequence;")
            tables = [row[0] for row in cursor.fetchall()]

            if not tables:
                self.stdout.write(self.style.WARNING("No sequences to reset."))
                return

            reset_count = 0
            for table in tables:
                # Get current max id; if table is empty, set sequence to 0 so next id = 1
                cursor.execute(f"SELECT MAX(id) FROM {table};")
                max_id = cursor.fetchone()[0]
                seq_value = max_id if max_id is not None else 0
                cursor.execute(
                    "UPDATE sqlite_sequence SET seq = ? WHERE name = ?;",
                    [seq_value, table],
                )
                reset_count += 1
                self.stdout.write(f"Reset sequence for table '{table}' to {seq_value}")

        self.stdout.write(self.style.SUCCESS(f"Done. Sequences reset for {reset_count} tables."))
