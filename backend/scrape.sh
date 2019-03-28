
for i in {0..999}
do
	echo "$i-"
	curl "https://skiapp.onthesnow.com/app/widgets/resortlist?region=us&regionids=$i&language=en&pagetype=skireport&direction=-1&order=stop&limit=1&offset=15&countrycode=USA&minvalue=-1&open=anystatus"
done
