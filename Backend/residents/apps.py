from django.apps import AppConfig


class ResidentsConfig(AppConfig):
    name = 'residents'

    def ready(self):
        import residents.signals
