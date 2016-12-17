tsc event-processor.ts && \
wt-bundle --output event-processor-bundle.js event-processor.js && \
wt cron schedule "* * * * *" event-processor-bundle.js && \
wt ls