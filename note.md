# Web Hitech

## Permissions

There are many permissions such as:

* Create post (a)
* Delete post (b)
* Update post (c)
* Approve post (d)
* Order goods (e)
* Chat with guests (f)
* Chat with staff/admin (g)
* Seclect post (h)
* Search for goods (i)
* Change staff (j)
* Create Staff (k)
* Delete Staff (l)
* Update Staff (m)
* View revenue reports, system activities (n)
* Cancel order (o)
* Update order (p)
* Update Staff (q)
* Comment/vote post (r)

## ROLE

There are 3 roles currently:

1. STAFF (a, b, c, d, f, h, i)
2. ADMIN (All Staff permission + j, k, l, m, n, q)
3. USER (e, f, h, i, o, p, r)

## Entity

There are currently the following entities:

* User
* Goods (Goods vs OrderItem Different ????)
* Role
* Permission
* Voucher
* Address
* InfoBuy (Information about Items)
* OrderItem
* InvalidatedToken
* Review

## Query Test

1. Login
* Input:
  + Right Login: ![img_2.png](img_2.png)
* Output:
  + Wrong Login: ![img_1.png](img_1.png)
2. Create User
* Input:
![img_3.png](img_3.png)
* Output:
  + Dont have Account: ![img_4.png](img_4.png)
  + Account Existed: ![img_5.png](img_5.png)
3. Update User
4. Find 1 User
* Input:![img_11.png](img_11.png)
* Output:![img_12.png](img_12.png)
5. Get All Users 
* Input: ![img_9.png](img_9.png)
* Output:![img_10.png](img_10.png)
6. Create Role 
* Input:
* Output:
7. Get All Roles
* Input:
* Output:
8. Delete Role
* Input:
* Output: 
9. Create Permission
* Input:![img_15.png](img_15.png)
* Output:![img_16.png](img_16.png)
10. Get All Permissions
* Input:
* Output:
11. Delete Permissions
* Input:
* Output: 
12. Check Login Token
* Input: ![img_6.png](img_6.png)
* Output:
  * True Token: ![img_7.png](img_7.png)
  * False Token: ![img_8.png](img_8.png)
13. Logout
* Input:![img_13.png](img_13.png)
* Output:![img_14.png](img_14.png)



