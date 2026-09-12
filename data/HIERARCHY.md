# Military hierarchy

Preserved from the previous repository's database/seed.sql. Legacy IDs are
crosswalk identifiers, not new SQLite primary keys. Additional units can be
added after their identity and parent relationship are established from sources.

| Unit | Abbreviation | Legacy ID | Parent | Directory |
| --- | --- | ---: | --- | --- |
| 5th Marine Regiment | 5thMar | 1 | None assigned in legacy seed | [5th Marines](units/5th_marines/UNIT.md) |
| 1st Battalion, 5th Marines | 1/5 | 8 | 5thMar | [1/5](units/5th_marines/1st_battalion/UNIT.md) |
| 2nd Battalion, 5th Marines | 2/5 | 2 | 5thMar | [2/5](units/5th_marines/2nd_battalion/UNIT.md) |
| Hotel Company | H/2/5 | 3 | 2/5 | [Hotel](units/5th_marines/2nd_battalion/companies/hotel/UNIT.md) |
| Golf Company | G/2/5 | 4 | 2/5 | [Golf](units/5th_marines/2nd_battalion/companies/golf/UNIT.md) |
| Foxtrot Company | F/2/5 | 5 | 2/5 | [Foxtrot](units/5th_marines/2nd_battalion/companies/foxtrot/UNIT.md) |
| Echo Company | E/2/5 | 6 | 2/5 | [Echo](units/5th_marines/2nd_battalion/companies/echo/UNIT.md) |
| Headquarters and Service Company | H&S/2/5 | 7 | 2/5 | [H&S](units/5th_marines/2nd_battalion/companies/headquarters_and_service/UNIT.md) |
| 3rd Battalion, 5th Marines | 3/5 | 14 | 5thMar | [3/5](units/5th_marines/3rd_battalion/UNIT.md) |
| Task Force Hotel | TF Hotel | 20 | Separate in legacy seed | [Task Force Hotel](task_forces/task_force_hotel/UNIT.md) |

Other source collections include 1st, 7th, and 9th Marines and aviation. They
are not children of 5th Marines. Task Force Hotel is not Hotel Company 2/5.
Record dated operational attachments separately from this catalog hierarchy.
