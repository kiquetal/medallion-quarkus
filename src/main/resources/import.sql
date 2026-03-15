INSERT INTO race (id, name, raceDate, distance, finishTime, location, category, medalType, notes, imagePath)
VALUES (nextval('Race_SEQ'), 'Boston Marathon 2024', '2024-04-15', 42.195, '3:45:12', 'Boston, MA', 'MARATHON', 'GOLD', 'Personal best!', null);

INSERT INTO race (id, name, raceDate, distance, finishTime, location, category, medalType, notes, imagePath)
VALUES (nextval('Race_SEQ'), 'NYC Half Marathon 2024', '2024-03-17', 21.1, '1:52:30', 'New York, NY', 'HALF_MARATHON', 'SILVER', 'Great weather', null);

INSERT INTO race (id, name, raceDate, distance, finishTime, location, category, medalType, notes, imagePath)
VALUES (nextval('Race_SEQ'), 'Central Park 10K', '2024-06-01', 10.0, '0:48:15', 'New York, NY', 'TEN_K', 'FINISHER', null, null);

INSERT INTO race (id, name, raceDate, distance, finishTime, location, category, medalType, notes, imagePath)
VALUES (nextval('Race_SEQ'), 'Chicago Marathon 2023', '2023-10-08', 42.195, '4:01:45', 'Chicago, IL', 'MARATHON', 'BRONZE', 'Tough wind conditions', null);

INSERT INTO race (id, name, raceDate, distance, finishTime, location, category, medalType, notes, imagePath)
VALUES (nextval('Race_SEQ'), 'Turkey Trot 5K', '2023-11-23', 5.0, '0:24:10', 'Denver, CO', 'FIVE_K', 'FINISHER', 'Fun family run', null);

INSERT INTO race (id, name, raceDate, distance, finishTime, location, category, medalType, notes, imagePath)
VALUES (nextval('Race_SEQ'), 'Ironman 70.3 Boulder', '2024-08-04', 113.0, '6:15:00', 'Boulder, CO', 'TRIATHLON', 'GOLD', 'First triathlon!', null);
