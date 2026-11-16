import redis
import os
# TODO: Add credential redis
# redis_client = aioredis.Connection(host="localhost", port=5437, db=0, password="", decode_responses=True)
REDIS_HOST=os.getenv("REDIS_HOST", "127.0.0.1")
REDIS_PORT=os.getenv("REDIS_PORT", 6379)
REDIS_PASSWORD=os.getenv("REDIS_PASSWORD", "")
REDIS_DB=os.getenv("REDIS_DB", 0)
redis_client = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, password=REDIS_PASSWORD, decode_responses=True)