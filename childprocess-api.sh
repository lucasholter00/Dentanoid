echo "API Childprocess launched!"
cd Clinic-Service/src/main/java/com/group20/dentanoid
# node GoogleAPI
cd GoogleAPI
node nodejsTest


<<comment
( sleep 40 ) & pid=$!
( sleep 20 && kill -HUP $pid ) 2>/dev/null & watcher=$!
if wait $pid 2>/dev/null; then
    echo "your_command finished"
    pkill -HUP -P $watcher
    wait $watcher
else
    echo "your_command interrupted"
fi
comment