# ORM Reference

## user

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| user.id | Long | Yes | Auto-generated (IDENTITY) | Primary key |
| user.email | String | No | null | - |
| user.username | String | No | null | - |
| user.firstName | String | No | null | - |
| user.lastName | String | No | null | - |
| user.password | String | No | null | Encrypted via `StringCryptoConverter` |

## admin

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| admin.user_id | Long | Yes | Inherited from user.id | Primary key, foreign key to `user.id` |

## customer

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| customer.user_id | Long | Yes | Inherited from user.id | Primary key, foreign key to `user.id` |
| customer.state | CustomerState (STRING) | No | null | Enum values: `ACTIVE`, `INACTIVE`, `SUSPENDED` |

### customer_promotion (join table)

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| customer_promotion.customer_id | Long | Yes | - | Foreign key to `customer.user_id` |
| customer_promotion.promotion_id | Long | Yes | - | Foreign key to `promotion.id` |

## payment_method

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| payment_method.id | Long | Yes | Auto-generated (IDENTITY) | Primary key |
| payment_method.customer_id | Long | Yes | - | Foreign key to `customer.user_id` |
| payment_method.cardNumber | Long | No | null | Stored card number |
| payment_method.cardHolderFirstName | String | No | null | - |
| payment_method.cardHolderLastName | String | No | null | - |
| payment_method.expirationDate | Date | No | null | `java.sql.Date` |
| payment_method.securityCode | int | Yes | 0 (primitive default) | 3–4 digit CVV |

## booking

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| booking.id | Long | Yes | Auto-generated (AUTO) | Primary key |
| booking.customer_id | Long | Yes | - | Foreign key to `customer.user_id` |

## ticket

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| ticket.id | Long | Yes | Auto-generated (IDENTITY) | Primary key |
| ticket.seatRow | int | Yes | 0 (primitive default) | Seat row index |
| ticket.seatCol | int | Yes | 0 (primitive default) | Seat column index |
| ticket.ticket_category_id | Long | Yes | - | Foreign key to `ticket_category.id` |
| ticket.showroom_id | Long | Yes | - | Foreign key to `showroom.id` |
| ticket.show_id | Long | Yes | - | Foreign key to `show.id` |
| ticket.booking_id | Long | No | null | Foreign key to `booking.id` (nullable until reserved) |

## ticket_category

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| ticket_category.id | Long | Yes | Auto-generated (IDENTITY) | Primary key |
| ticket_category.name | String | No | null | Category label (adult, child, etc.) |
| ticket_category.price | double | Yes | 0.0 (primitive default) | Ticket price |

## show

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| show.id | Long | Yes | Auto-generated (AUTO) | Primary key |
| show.duration | int | Yes | 0 (primitive default) | Duration in minutes |
| show.date | Date | No | null | `java.sql.Date` |
| show.startTime | Time | No | null | `java.sql.Time` |
| show.endTime | Time | No | null | `java.sql.Time` |
| show.movie_id | Long | Yes | - | Foreign key to `movie.id` |
| show.showroom_id | Long | Yes | - | Foreign key to `showroom.id` |

## showroom

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| showroom.id | Long | Yes | Auto-generated (AUTO) | Primary key |
| showroom.theater_id | Long | Yes | - | Foreign key to `theater.id` |
| showroom.seatCount | int | Yes | Computed (roomHeight × roomWidth) | Derived seat total |
| showroom.roomWidth | int | Yes | 0 (primitive default) | Must be ≥ 1 |
| showroom.roomHeight | int | Yes | 0 (primitive default) | Must be ≥ 1 |
| showroom.seats | boolean[][] | N/A | Initialized empty | Transient field, not persisted |

## theater

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| theater.id | Long | Yes | Auto-generated (AUTO) | Primary key |
| theater.cinema_id | Long | Yes | - | Foreign key to `cinema.id` |
| theater.name | String | No | null | - |
| theater.address | String | No | null | - |

## cinema

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| cinema.id | Long | Yes | Auto-generated (AUTO) | Primary key |
| cinema.name | String | No | null | - |

## review

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| review.id | Long | Yes | Auto-generated (IDENTITY) | Primary key |
| review.movie_id | Long | Yes | - | Foreign key to `movie.id` |
| review.rating | int | Yes | 0 (primitive default) | Review rating |
| review.comment | String | No | null | - |

## promotion

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| promotion.id | Long | Yes | Auto-generated (AUTO) | Primary key |
| promotion.code | String | Yes | null | Non-null at runtime, unique constraint |
| promotion.discountPercentage | double | Yes | 0.0 (primitive default) | Valid range 0.0–1.0 |

## movie

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| movie.id | Long | Yes | Auto-generated (AUTO) | Primary key |
| movie.title | String | No | null | - |
| movie.movieGenre | Movie.Genre (STRING) | No | null | Enum stored as text |
| movie.director | String | No | null | - |
| movie.producer | String | No | null | - |
| movie.synopsis | String | No | null | - |
| movie.trailerLink | String | No | null | - |
| movie.posterLink | String | No | null | - |
| movie.mpaaRating | Movie.MPAA_Rating (STRING) | No | null | Enum stored as text |

### movie_cast (element collection)

| TABLE NAME | TYPE | REQUIRED | DEFAULT | NOTES |
| --- | --- | --- | --- | --- |
| movie_cast.movie_id | Long | Yes | - | Foreign key to `movie.id` |
| movie_cast.cast | String | Yes | null | Stored cast member name |
