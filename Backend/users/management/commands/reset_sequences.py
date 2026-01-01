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
                # Detect primary key column via PRAGMA; support custom PK names (ma_phi, ma_dot, ...)
                cursor.execute(f"PRAGMA table_info('{table}');")
                columns = cursor.fetchall()
                pk_cols = [c for c in columns if c[5] == 1]  # pk flag
                if not pk_cols:
                    self.stdout.write(self.style.WARNING(f"Skip table '{table}' (no PK column)"))
                    continue

                pk_col = pk_cols[0][1]  # column name
                try:
                    cursor.execute(f"SELECT MAX({pk_col}) FROM '{table}';")
                    max_id = cursor.fetchone()[0]
                except Exception as exc:
                    self.stdout.write(self.style.WARNING(f"Skip table '{table}' (cannot read PK): {exc}"))
                    continue

                seq_value = max_id if max_id is not None else 0
                cursor.execute(
                    f"UPDATE sqlite_sequence SET seq = {int(seq_value)} WHERE name = '{table}';"
                )
                reset_count += 1
                self.stdout.write(f"Reset sequence for table '{table}' (PK: {pk_col}) to {seq_value}")

        self.stdout.write(self.style.SUCCESS(f"Done. Sequences reset for {reset_count} tables."))
