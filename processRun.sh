cat run1 | grep recieved | awk '{print $3 " " $4 }' | sort | uniq -c