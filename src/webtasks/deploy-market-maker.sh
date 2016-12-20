tsc market-maker.ts && \
wt-bundle --output market-maker-bundle.js market-maker.js && \
wt cron schedule "* * * * *" market-maker-bundle.js && \
wt ls