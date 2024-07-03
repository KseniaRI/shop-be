"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = async (event) => {
    console.log("request", JSON.stringify(event));
    const [products] = event.Records.map(record => JSON.parse(record.body));
    console.log('products from sqs:', products);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0YWxvZ0JhdGNoUHJvY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhdGFsb2dCYXRjaFByb2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFlLEVBQUUsRUFBRTtJQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUV4RSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRWhELENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNRU0V2ZW50LCBTUVNIYW5kbGVyIH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogU1FTRXZlbnQpID0+IHsgXHJcbiAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RcIiwgSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcclxuICAgIGNvbnN0IFtwcm9kdWN0c10gPSBldmVudC5SZWNvcmRzLm1hcChyZWNvcmQgPT4gSlNPTi5wYXJzZShyZWNvcmQuYm9keSkpO1xyXG4gICBcclxuICAgIGNvbnNvbGUubG9nKCdwcm9kdWN0cyBmcm9tIHNxczonLCBwcm9kdWN0cyk7XHJcbiAgICBcclxufSJdfQ==