DROP TABLE IF EXISTS "Patient_Info" CASCADE;

CREATE TABLE IF NOT EXISTS "Patient_Info" (
    "patient_id" VARCHAR(255) UNIQUE,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255),
    "age" INTEGER NOT NULL,
    "user_identification" VARCHAR(255),
    PRIMARY KEY("patient_id")
);

DROP TABLE IF EXISTS "Relation_Info" CASCADE;

CREATE TABLE IF NOT EXISTS "Relation_Info" (
    "relation_name" VARCHAR(255),
    "relation_id" serial,
    PRIMARY KEY("relation_name")
);

DROP TABLE IF EXISTS "Family_Info" CASCADE;

CREATE TABLE IF NOT EXISTS "Family_Info" (
    "patient_id" VARCHAR(255) UNIQUE,
    "osteoporosis" INTEGER[],
    "cancer" INTEGER[],
    "type_of_cancer" VARCHAR(255)[],
    "bleeding_disorder" INTEGER[],
    "diabetes" INTEGER[],
    "high_blood_pressure" INTEGER[],
    "strokes" INTEGER[],
    "heart_attack" INTEGER[],
    "genetic_disorder" INTEGER[],
    "other_diseases" TEXT,
    PRIMARY KEY("relation_name"),
    FOREIGN KEY("patient_id") REFERENCES "Patient_Info"("patient_id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Personal_History" CASCADE;

CREATE TABLE IF NOT EXISTS "Personal_History" (
    "allergies" TEXT[],
    "medications_supplements" VARCHAR(255) UNIQUE,
    "accidents" VARCHAR(255) UNIQUE,
    "surgeries" VARCHAR(255) UNIQUE,
    "patient_id" VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY("patient_id") REFERENCES "Patient_Info"("patient_id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Medications_Supplements" CASCADE;

CREATE TABLE IF NOT EXISTS "Medications_Supplements" (
    "medications" TEXT,
    "dosage" TEXT,
    "shv_otc" TEXT,
    "mgs_per_day" TEXT,
    "patient_id" VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY("patient_id") REFERENCES "Patient_Info"("patient_id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Accidents" CASCADE;

CREATE TABLE IF NOT EXISTS "Accidents" (
    "year" INTEGER,
    "type" VARCHAR(255),
    "residual_problem" TEXT,
    "patient_id" VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY("patient_id") REFERENCES "Patient_Info"("patient_id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Surgery_Hospitalization" CASCADE;

CREATE TABLE IF NOT EXISTS "Surgery_Hospitalization" (
    "doctor_id" TEXT[],
    "problem_type" VARCHAR(255) UNIQUE,
    "year" VARCHAR(255) UNIQUE,
    "residual_problem" VARCHAR(255) UNIQUE,
    "comments" TEXT,
    "patient_id" VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY("patient_id") REFERENCES "Patient_Info"("patient_id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Roles" CASCADE;

CREATE TABLE IF NOT EXISTS "Roles" (
    "role_id" serial PRIMARY KEY,
    "role_description" VARCHAR(255) UNIQUE NOT NULL
)

DROP TABLE IF EXISTS "Login_Info" (
    "login_id" VARCHAR(255) PRIMARY KEY,
    "password" VARCHAR(255) NOT NULL,
    "role" INTEGER NOT NULL,
    FOREIGN KEY("role") REFERENCES "Roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Insurer_Info" CASCADE;

CREATE TABLE IF NOT EXISTS "Insurer_Info" (
    "insurer_id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255)
);

DROP TABLE IF EXISTS "Patient_Insurer" CASCADE;

CREATE TABLE IF NOT EXISTS "Patient_Insurer" (
    "patient_id" VARCHAR(255) UNIQUE,
    "insurer_id" VARCHAR(255) UNIQUE,
    PRIMARY KEY("patient_id"),
    FOREIGN KEY("patient_id") REFERENCES "Patient_Info"("patient_id"),
    FOREIGN KEY("insurer_id") REFERENCES "Insurer_Info"("insurer_id")
);

DROP TABLE IF NOT EXISTS "Mediclaim_Info" CASCADE;

CREATE TABLE IF NOT EXISTS "Mediclaim_Info" (
    "policy_id" VARCHAR(255) PRIMARY KEY,
    "insurer_id" VARCHAR(255) NOT NULL,
    "policy_date" DATE NOT NULL,
    "years_valid" INTEGER NOT NULL,
    "patient_id" VARCHAR(255) NOT NULL,
    "policy_doc_link" VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY("patient_id") REFERENCES "Patient_Info"("patient_id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY("insurer_id") REFERENCES "Insurer_Info"("insurer_id") ON DELETE SET NULL ON UPDATE CASCADE
);




