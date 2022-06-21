# Reviews_Postgres

System Design Requirements:  
Latency Goal: < 2,000 ms under load  
Throughput on single EC2 instance: 100 RPS  
Error Rate Goal: < 1% under load  
  
## Initial local test  
Postgres queries are promising already below 2000ms latency cap:  
![k6 testing](https://user-images.githubusercontent.com/100612152/174858916-a8b050ba-840e-48c7-9a0c-561dc0b7e41d.png)  
  
Improve efficiency:
- Add indexes and set access method to "hash".
- Refactored looping query for building an array of photos into a single query. Reduced stress on the database which was affecting response times.
- Refactored insert into values (row constructor) for adding photos to the database, to insert into select (table constructor). Values required about 15-20 lines of code, and Select only required 3.

## Deploy EC2 instance and stress test using Loader.io   
Initial test of 100 RPS looked promising with average response after initial spike between 2 - 3 ms and 0.0% error rate. Database is both consistent and fast. Next stress load will increase to 1,000 RPS:  
![Screen Shot 2022-06-17 at 11 56 53 AM](https://user-images.githubusercontent.com/100612152/174859429-c649672e-cf76-4ac6-9365-f38ff539b401.png)  
  
Stress test of 1,000 RPS also looks fantastic with an average response after the initial spike between 2 - 5 ms and continues to hold a 0.0% error rate.
Database continues to be consistent and fast despite the significantly higher sress load and surpasses the goals for the System Requirements.  
![Screen Shot 2022-06-17 at 12 00 22 PM](https://user-images.githubusercontent.com/100612152/174860406-d08924f4-1de8-4b35-b490-8eb11dfbd2f0.png)  
  
Final test of 3,000 RPS to determine when scaling would be necessary. With this amount of stress load, response times are still below the 2,000 ms latency threshold, with the average response time of 1,625 ms and continues to be consistent with an incredible 0.0% error rate. So despite the slower response times, users will still get the data they're looking for.  
![Screen Shot 2022-06-17 at 12 03 47 PM](https://user-images.githubusercontent.com/100612152/174861676-198f03e1-6a63-4c4a-bf75-f3d0f157c49c.png)


1,625 ms response times do not give a great user experience. Recommend scaling horizontally to increase throughput capabilities.
  
  
