--
-- PostgreSQL database dump
--

-- Dumped from database version 13.21 (Debian 13.21-1.pgdg120+1)
-- Dumped by pg_dump version 13.21 (Debian 13.21-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DeliveryStatus; Type: TYPE; Schema: public; Owner: franyehizer
--

CREATE TYPE public."DeliveryStatus" AS ENUM (
    'pending',
    'in_transit',
    'delivered'
);


ALTER TYPE public."DeliveryStatus" OWNER TO franyehizer;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: franyehizer
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'pending',
    'paid',
    'shipped',
    'delivered',
    'cancelled'
);


ALTER TYPE public."OrderStatus" OWNER TO franyehizer;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: franyehizer
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'PayPal',
    'Venmo',
    'Zelle',
    'Credit_Card',
    'Debit_Card',
    'Apple_Pay',
    'Google_Pay',
    'Cripto',
    'Stripe'
);


ALTER TYPE public."PaymentMethod" OWNER TO franyehizer;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: franyehizer
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'refunded'
);


ALTER TYPE public."PaymentStatus" OWNER TO franyehizer;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: franyehizer
--

CREATE TYPE public."UserRole" AS ENUM (
    'admin'
);


ALTER TYPE public."UserRole" OWNER TO franyehizer;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Delivery; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public."Delivery" (
    id integer NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    status public."DeliveryStatus" DEFAULT 'pending'::public."DeliveryStatus" NOT NULL
);


ALTER TABLE public."Delivery" OWNER TO franyehizer;

--
-- Name: Delivery_id_seq; Type: SEQUENCE; Schema: public; Owner: franyehizer
--

CREATE SEQUENCE public."Delivery_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Delivery_id_seq" OWNER TO franyehizer;

--
-- Name: Delivery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: franyehizer
--

ALTER SEQUENCE public."Delivery_id_seq" OWNED BY public."Delivery".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO franyehizer;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: franyehizer
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Message_id_seq" OWNER TO franyehizer;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: franyehizer
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    client_name text NOT NULL,
    client_email text NOT NULL,
    order_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total numeric(10,2) NOT NULL,
    status public."OrderStatus" DEFAULT 'pending'::public."OrderStatus" NOT NULL,
    id_payment integer,
    id_delivery integer
);


ALTER TABLE public."Order" OWNER TO franyehizer;

--
-- Name: OrderDetail; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public."OrderDetail" (
    id_order_detail integer NOT NULL,
    id_order integer NOT NULL,
    id_product integer,
    quantity integer NOT NULL,
    price_unit numeric(10,2) NOT NULL,
    product_image_url text,
    product_name text
);


ALTER TABLE public."OrderDetail" OWNER TO franyehizer;

--
-- Name: OrderDetail_id_order_detail_seq; Type: SEQUENCE; Schema: public; Owner: franyehizer
--

CREATE SEQUENCE public."OrderDetail_id_order_detail_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderDetail_id_order_detail_seq" OWNER TO franyehizer;

--
-- Name: OrderDetail_id_order_detail_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: franyehizer
--

ALTER SEQUENCE public."OrderDetail_id_order_detail_seq" OWNED BY public."OrderDetail".id_order_detail;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: franyehizer
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_id_seq" OWNER TO franyehizer;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: franyehizer
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    method public."PaymentMethod" NOT NULL,
    status public."PaymentStatus" DEFAULT 'pending'::public."PaymentStatus" NOT NULL,
    receipt text,
    "chargeId" text,
    "paymentIntentId" text
);


ALTER TABLE public."Payment" OWNER TO franyehizer;

--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: franyehizer
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Payment_id_seq" OWNER TO franyehizer;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: franyehizer
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    year integer NOT NULL,
    country_origin text NOT NULL,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    image_url text,
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Product" OWNER TO franyehizer;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: franyehizer
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO franyehizer;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: franyehizer
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public."User" (
    id_user integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'admin'::public."UserRole" NOT NULL
);


ALTER TABLE public."User" OWNER TO franyehizer;

--
-- Name: User_id_user_seq; Type: SEQUENCE; Schema: public; Owner: franyehizer
--

CREATE SEQUENCE public."User_id_user_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_user_seq" OWNER TO franyehizer;

--
-- Name: User_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: franyehizer
--

ALTER SEQUENCE public."User_id_user_seq" OWNED BY public."User".id_user;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: franyehizer
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO franyehizer;

--
-- Name: Delivery id; Type: DEFAULT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Delivery" ALTER COLUMN id SET DEFAULT nextval('public."Delivery_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderDetail id_order_detail; Type: DEFAULT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."OrderDetail" ALTER COLUMN id_order_detail SET DEFAULT nextval('public."OrderDetail_id_order_detail_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: User id_user; Type: DEFAULT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."User" ALTER COLUMN id_user SET DEFAULT nextval('public."User_id_user_seq"'::regclass);


--
-- Data for Name: Delivery; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public."Delivery" (id, address, city, country, status) FROM stdin;
27	Calle Falsa 123	Buenos Aires	Argentina	in_transit
33	Calle Falsa 123	Buenos Aires	Argentina	pending
35	Calle Falsa 123	Buenos Aires	Argentina	pending
29	Calle Falsa 123	Buenos Aires	Argentina	in_transit
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public."Message" (id, name, email, message, "createdAt") FROM stdin;
3	Ehizer Valero	ehizerjesus08@gmail.com	Jabon	2025-07-17 01:10:23.666
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public."Order" (id, client_name, client_email, order_date, total, status, id_payment, id_delivery) FROM stdin;
32	Juan Perez	juan@example.com	2025-08-02 00:32:02.168	3500.50	paid	33	35
26	Juan Perez	juan@example.com	2025-08-01 22:19:52.658	3500.50	paid	27	29
25	Juan Perez	juan@example.com	2025-08-01 22:18:15.449	3500.50	delivered	26	27
30	Juan Perez	juan@example.com	2025-08-02 00:15:29.56	3500.50	paid	31	33
\.


--
-- Data for Name: OrderDetail; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public."OrderDetail" (id_order_detail, id_order, id_product, quantity, price_unit, product_image_url, product_name) FROM stdin;
44	25	1	2	1500.25	https://storage.googleapis.com/coinbase_storage-2025/3ac06c84-b16b-4c66-8484-9e38faf7e2c2.webp	Billete antiguo 1920
45	26	1	2	1500.25	https://storage.googleapis.com/coinbase_storage-2025/3ac06c84-b16b-4c66-8484-9e38faf7e2c2.webp	
49	30	6	2	13.00	https://storage.googleapis.com/coinbase_storage-2025/9627e318-5b30-4571-9662-1756fc5a100f.webp	Monedas Antiguas De Uruguay Grandes 1,10,100 Pesos
51	32	6	2	13.00	https://storage.googleapis.com/coinbase_storage-2025/9627e318-5b30-4571-9662-1756fc5a100f.webp	Monedas Antiguas De Uruguay Grandes 1,10,100 Pesos
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public."Payment" (id, method, status, receipt, "chargeId", "paymentIntentId") FROM stdin;
27	Venmo	approved	https://storage.googleapis.com/coinbase_storage-2025/8fa808de-be99-4b24-9fb6-65353c5d3a70.jpg	\N	\N
26	Venmo	approved	\N	\N	\N
31	Stripe	approved	\N	\N	\N
33	Venmo	approved	https://storage.googleapis.com/coinbase_storage-2025/4166d715-2622-441d-bd69-ab83e595df01.jpg	\N	\N
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public."Product" (id, name, description, year, country_origin, price, stock, image_url, deleted) FROM stdin;
7	Ehizer Valero	asdwadsa	1701	Argentina	2000.00	10	/uploads/Interiro-cantina-Mos-Eisley-DOS-1753890740537-677491637.jpg	t
3	Billetes Antiguos Brasil	Es un billete de 50 uno de 20 y otro 2 reales en perfectas condiciones muy bien preservados	1939	Brasil	200.00	2	https://storage.googleapis.com/coinbase_storage-2025/c89b660b-fb23-442a-a3d7-7d6c0c6af34d.webp	f
2	Billete de 1 Dolar	Billete de 1 Dolar en increible estado	2000	USA	29.00	0	https://storage.googleapis.com/coinbase_storage-2025/f7c89466-d32b-410e-b107-3d4325e10fde.jpg	f
4	Pesetas españolas 	Distintas monedas de distintos valores, de pesetas españolas 1949,2001	1949	España	100.00	1	https://storage.googleapis.com/coinbase_storage-2025/5ce54553-6018-485c-8d91-5c840706c5ad.jpg	f
5	Billete mexicano 100000 pesos	Un increible billete de 100000 pesos	1978	Mexico	100.00	4	https://storage.googleapis.com/coinbase_storage-2025/346f6d90-14a3-4da4-bfd3-a78501a6c2f6.jpg	f
6	Monedas Antiguas De Uruguay Grandes 1,10,100 Pesos	No hay nueva descripcion	1925	Uruguay	13.00	4	https://storage.googleapis.com/coinbase_storage-2025/9627e318-5b30-4571-9662-1756fc5a100f.webp	f
1	Billete de 100	Dios mio un billete de 100 pesos en excelente estado como podrias desaprovechar esta oportunidad?	2008	Argentina	100.00	6	https://storage.googleapis.com/coinbase_storage-2025/3ac06c84-b16b-4c66-8484-9e38faf7e2c2.webp	f
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public."User" (id_user, name, email, password, role) FROM stdin;
1	Admin	admin@admin.com	$2b$10$WBEnE/F.rqf4x7npp5RNXeFPHgxRmatFFNdHFJUmgNs98JQYU13Sa	admin
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: franyehizer
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c00731e6-465a-470b-afeb-0c6e03516fd1	691af97f8c186456784b7e2d0e353eeb7a87f9beff7daac93ef27cf1d1f8e9ff	2025-06-27 22:44:51.170253+00	20250405185034_init	\N	\N	2025-06-27 22:44:50.326016+00	1
a1625122-28d8-49a3-9dc4-724e1cd6a800	db26e87073a6cedccf0e1d71111f9a95ce73b28c224d6a7326876d6b0ac1d7b1	2025-06-27 22:44:51.395462+00	20250408232732_agregue_message	\N	\N	2025-06-27 22:44:51.194257+00	1
0a2d3037-b6b9-400f-8f9d-89bbaaccbecc	3180d5890e5c90e03205aa89d528394e8d0ef20bac0789050b0a8518cbb843b1	2025-06-27 23:00:38.124783+00	20250627230038_add_stripe_fields	\N	\N	2025-06-27 23:00:38.036852+00	1
bb72594a-b4cf-4b0a-97f9-de3c495cdc55	f7a53bc294d918c21f5787499e587eb7fab7ed1436310526134d2ec3818c703c	2025-07-29 22:03:42.449029+00	20250729220341_agregar_product_name_nullable	\N	\N	2025-07-29 22:03:41.89726+00	1
\.


--
-- Name: Delivery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: franyehizer
--

SELECT pg_catalog.setval('public."Delivery_id_seq"', 37, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: franyehizer
--

SELECT pg_catalog.setval('public."Message_id_seq"', 3, true);


--
-- Name: OrderDetail_id_order_detail_seq; Type: SEQUENCE SET; Schema: public; Owner: franyehizer
--

SELECT pg_catalog.setval('public."OrderDetail_id_order_detail_seq"', 53, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: franyehizer
--

SELECT pg_catalog.setval('public."Order_id_seq"', 34, true);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: franyehizer
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 35, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: franyehizer
--

SELECT pg_catalog.setval('public."Product_id_seq"', 7, true);


--
-- Name: User_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: franyehizer
--

SELECT pg_catalog.setval('public."User_id_user_seq"', 1, true);


--
-- Name: Delivery Delivery_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Delivery"
    ADD CONSTRAINT "Delivery_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: OrderDetail OrderDetail_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_pkey" PRIMARY KEY (id_order_detail);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id_user);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: franyehizer
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: OrderDetail OrderDetail_id_order_fkey; Type: FK CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_id_order_fkey" FOREIGN KEY (id_order) REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderDetail OrderDetail_id_product_fkey; Type: FK CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_id_product_fkey" FOREIGN KEY (id_product) REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_id_delivery_fkey; Type: FK CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_id_delivery_fkey" FOREIGN KEY (id_delivery) REFERENCES public."Delivery"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_id_payment_fkey; Type: FK CONSTRAINT; Schema: public; Owner: franyehizer
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_id_payment_fkey" FOREIGN KEY (id_payment) REFERENCES public."Payment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

