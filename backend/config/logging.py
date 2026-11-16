from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "default": {
            "format": (
                "[%(asctime)s]"
                "[%(levelname)-8s]"
                "[%(name)s]"
                "> %(message)s"
            )
        },
        "verbose": {
            "format": (
                "[%(asctime)s]"
                "[%(levelname)-8s]"
                "[%(funcName)s]"
                "[%(name)s]"
                "[%(filename)s:%(lineno)d]"
                "> %(message)s"
            )
        },
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },

        "app_file": {
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": BASE_DIR / "logs/app.log",
            "when": "midnight",
            "backupCount": 30,
            "encoding": "utf-8",
            "formatter": "verbose",
        },

        "access_file": {
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": BASE_DIR / "logs/access.log",
            "when": "midnight",
            "backupCount": 30,
            "encoding": "utf-8",
            "formatter": "default",
        },

        "error_file": {
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": BASE_DIR / "logs/error.log",
            "when": "midnight",
            "backupCount": 90,
            "encoding": "utf-8",
            "formatter": "verbose",
        },

        "audit_file": {
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": BASE_DIR / "logs/audit.log",
            "when": "midnight",
            "backupCount": 180,
            "encoding": "utf-8",
            "formatter": "default",
        },
    },

    "loggers": {
        "django": {
            "handlers": ["console", "app_file"],
            "level": "INFO",
            "propagate": True,
        },

        "access": {
            "handlers": ["access_file"],
            "level": "INFO",
            "propagate": False,
        },

        "audit": {
            "handlers": ["audit_file"],
            "level": "INFO",
            "propagate": False,
        },

        "error": {
            "handlers": ["error_file"],
            "level": "WARNING",
            "propagate": False,
        },

        "myapp": {
            "handlers": ["console", "app_file"],
            "level": "INFO",
            "propagate": False,
        }
    }
}