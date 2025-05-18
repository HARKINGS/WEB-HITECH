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
  + Right Login: ![img_2.png](img/img_2.png)
* Output:
  + Wrong Login: ![img_1.png](img/img_1.png)
2. Create User
* Input: ![img_3.png](img/img_3.png)
* Output:
  + Dont have Account: ![img_4.png](img/img_4.png)
  + Account Existed: ![img_5.png](img/img_5.png)
3. Update User
* Input: ![img_19.png](img/img_19.png)
* Output: ![img_20.png](img/img_20.png)
4. Find 1 User
* Input:![img_11.png](img/img_11.png)
* Output:![img_12.png](img/img_12.png)
5. Get All Users 
* Input: ![img_9.png](img/img_9.png)
* Output:![img_10.png](img/img_10.png)
6. Create Role 
* Input: 
* Output:
7. Get All Roles
* Input: ![img_28.png](img/img_28.png)
* Output: ![img_29.png](img/img_29.png) ![img_30.png](img/img_30.png) ![img_31.png](img/img_31.png)
8. Delete Role
* Input:
* Output: 
9. Create Permission
* Input:![img_15.png](img/img_15.png)
* Output:
  + New permission: ![img_16.png](img/img_16.png)
  + Permission existed: ![img_25.png](img/img_25.png)
10. Get All Permissions
* Input: ![img_23.png](img/img_23.png)
* Output: ![img_24.png](img/img_24.png)
11. Delete Permissions
* Input: ![img_26.png](img/img_26.png)
* Output: ![img_27.png](img/img_27.png)
12. Check Login Token
* Input: ![img_6.png](img/img_6.png)
* Output:
  * True Token: ![img_7.png](img/img_7.png)
  * False Token: ![img_8.png](img/img_8.png)
13. Logout
* Input:![img_13.png](img/img_13.png)
* Output:![img_14.png](img/img_14.png)
14. Delete User
* Input: ![img_21.png](img/img_21.png)
* Output: ![img_22.png](img/img_22.png)



