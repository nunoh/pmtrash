fin = open("points.txt");
fout = open("inserts.sql", "w");
lines = fin.readlines();

for line in lines:
	
	line = line.replace("\r", "");
	line = line.replace("\n", "");

	comma = line.find(",");
	lat = line[:comma];
	lng = line[comma+1:];
	
	sql = "INSERT INTO containers (areaID, Latitude, Longitude) VALUES (0, ";	
	sql += "'" + lat + "','" + lng + "');";

	print sql;
	fout.write(sql);
	fout.write("\n");

fin.close();
fout.close();