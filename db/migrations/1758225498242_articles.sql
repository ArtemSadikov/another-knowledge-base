-- Up Migration
create table articles (
    id uuid default uuid_generate_v4()
        constraint __articles_pk primary key,

    title character varying(120) not null,
    content text,
    published boolean default false not null,

    author_id uuid not null,

    created_at timestamp without time zone default now() not null,
    updated_at timestamp without time zone default now() not null,
    deleted_at timestamp without time zone,

    constraint __author_id_fk
        foreign key (author_id) references users(id)
            on delete cascade
            on update cascade
);

-- Down Migration
drop table articles;
