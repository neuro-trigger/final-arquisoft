# 👤 User Service — PostgreSQL Database

This document describes the data schema of the **User Service**, which manages identity, verification, and budgeting data within the banking platform.

This service **integrates directly with the Transactions Service**, where both `users` and `pockets` are interpreted as **financial accounts**. This abstraction allows for seamless money transfers between users and between their pockets.

---

## 🧾 Schema Overview

The PostgreSQL database consists of the following tables:

- [`user`](#user)
- [`country_code`](#country_code)
- [`favorites`](#favorites)
- [`verification`](#verification)
- [`pocket`](#pocket)

---

## 🔁 Relationship with Transactions Service

In the **Transactions** service, both **users and pockets are modeled as TigerBeetle accounts**.

- ✅ A `user` can **receive or send money** from/to:
  - Other users
  - Their own pockets

- ✅ A `pocket` can **only interact** with its **owning user**.
  - It is used for internal money organization (e.g. budgets, goals).
  - It cannot receive funds from other users.

This design allows TigerBeetle to treat both as `Account` structures, each with unique identifiers, encoded fields, and behavioral flags.

---

## 🧍‍♂️ Table: `user`

Represents a registered and verified user.

| Field       | Type        | Description |
|-------------|-------------|-------------|
| `id`        | `char(36)`  | UUID primary key. Foreign-keyed in pockets, favorites, verifications, and Transactions service. |
| `email`     | `varchar`   | Unique email address for communication and login. |
| `username`  | `varchar`   | Public identifier, encoded in Transactions service. |
| `phone`     | `varchar`   | Optional phone number for contact and 2FA. |
| `code_id`   | `char(36)`  | FK to `country_code`. Associates phone/email with regional identity. |
| `first_name`| `varchar`   | User’s given name. |
| `last_name` | `varchar`   | User’s family name. |
| `birthdate` | `date`      | Date of birth for compliance and identity verification. |
| `created_at`| `timestamp` | Record creation timestamp. |
| `updated_at`| `timestamp` | Last modification timestamp. |
| `deleted_at`| `timestamp` | Soft delete timestamp for data recovery. |

---

## 🌐 Table: `country_code`

Stores country dialing information and metadata.

| Field   | Type       | Description |
|---------|------------|-------------|
| `id`    | `char(36)` | UUID primary key. |
| `name`  | `varchar`  | Full country name (e.g. "Colombia"). |
| `code`  | `integer`  | Numeric dialing code (e.g. 57 for Colombia). |

---

## 💚 Table: `favorites`

User’s saved contact list of preferred users.

| Field             | Type       | Description |
|------------------|------------|-------------|
| `id`             | `char(36)` | UUID primary key. |
| `user_id`        | `char(36)` | FK to `user` who owns the list. |
| `favorite_user_id` | `char(36)` | FK to another user who is favorited. |
| `alias`          | `varchar`  | Optional nickname for the favorite user. |
| `created_at`     | `timestamp`| Creation timestamp. |
| `deleted_at`     | `timestamp`| Soft delete. |

---

## ✅ Table: `verification`

Tracks verification attempts for email and phone.

| Field       | Type                   | Description |
|-------------|------------------------|-------------|
| `id`        | `char(36)`             | UUID primary key. |
| `user_id`   | `char(36)`             | FK to `user`. |
| `type`      | `enum(email, phone)`   | Type of verification. |
| `status`    | `enum(UPDATED, PENDING, COMPLETE)` | Verification state. |
| `created_at`| `timestamp`            | When the attempt was made. |
| `updated_at`| `timestamp`            | Last updated time. |

---

## 💼 Table: `pocket`

Represents budget containers or spending categories for a user. **Each pocket is treated as a TigerBeetle account** with restricted interaction scope (only its owner can transact with it).

| Field        | Type                                                     | Description |
|--------------|----------------------------------------------------------|-------------|
| `id`         | `char(36)`                                               | UUID primary key. |
| `user_id`    | `char(36)`                                               | FK to the `user` who owns the pocket. |
| `name`       | `varchar`                                                | User-defined pocket name (e.g. “Emergency Fund”). |
| `category`   | `enum(HOME, EMERGENCY, TRIPS, ENTERTAINMENT, STUDIES, TRANSPORTATION, DEBT, OTHER)` | Classification for UI/analytics. |
| `max_amount` | `decimal(12,2)`                                          | Spending/budget cap. |
| `created_at` | `timestamp`                                              | Record creation timestamp. |
| `updated_at` | `timestamp`                                              | Last update timestamp. |
| `deleted_at` | `timestamp`                                              | Soft delete flag. |

---