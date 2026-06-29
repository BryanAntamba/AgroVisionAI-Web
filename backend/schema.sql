Obligatorio en este proyecto)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- 2. Función automática para actualizar la fecha de modificación
CREATE OR REPLACE FUNCTION public.actualizar_fecha() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
BEGIN    
    NEW.actualizado_en = CURRENT_TIMESTAMP;    
    RETURN NEW; 
END; 
$$;

-- 3. Crear Tabla: Roles
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    nombre character varying(50) NOT NULL UNIQUE
);

-- 4. Crear Tabla: Usuarios
CREATE TABLE public.usuarios (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    rol_id integer NOT NULL REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    correo_empresarial character varying(150) NOT NULL UNIQUE,
    correo_personal character varying(150) UNIQUE,
    telefono character varying(20),
    password_hash character varying(255) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_email_empresarial CHECK (((correo_empresarial)::text ~~ '%@%'::text)),
    CONSTRAINT check_email_personal CHECK (((correo_personal IS NULL) OR ((correo_personal)::text ~~ '%@%'::text)))
);

-- 5. Crear Tabla: Recomendaciones
CREATE TABLE public.recomendaciones (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE,
    titulo character varying(150) NOT NULL,
    descripcion text,
    accion_recomendada text,
    prioridad character varying(20),
    color character varying(7),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_color CHECK (((color IS NULL) OR ((color)::text ~ '^#[0-9A-Fa-f]{6}$'::text))),
    CONSTRAINT recomendaciones_prioridad_check CHECK (((prioridad)::text = ANY (ARRAY['baja', 'media', 'alta', 'critica'])))
);

-- 6. Crear Tabla: Códigos de Recuperación
CREATE TABLE public.codigos_recuperacion (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE,
    codigo character varying(6) NOT NULL,
    expira_en timestamp without time zone NOT NULL,
    usado boolean DEFAULT false,
    intentos integer DEFAULT 0,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_codigo CHECK (((codigo)::text ~ '^[0-9]{6}$'::text)),
    CONSTRAINT max_intentos CHECK ((intentos <= 5))
);

-- 7. Crear Tabla: Historial de Contraseñas (para evitar reutilización)
CREATE TABLE public.password_histories (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE,
    password_hash character varying(255) NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 8. Crear Índices para que las búsquedas sean rápidas
CREATE INDEX idx_usuario_rol ON public.usuarios USING btree (rol_id);
CREATE INDEX idx_recomendacion_usuario ON public.recomendaciones USING btree (usuario_id);
CREATE INDEX idx_codigo_usuario ON public.codigos_recuperacion USING btree (usuario_id);
CREATE INDEX idx_password_history_usuario ON public.password_histories USING btree (usuario_id);
CREATE UNIQUE INDEX codigo_unico_activo ON public.codigos_recuperacion USING btree (usuario_id, codigo) WHERE (usado = false);

-- 9. Crear los Triggers para que las fechas se actualicen solas
CREATE TRIGGER update_usuarios_trigger
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_fecha();

CREATE TRIGGER update_recomendaciones_trigger
    BEFORE UPDATE ON public.recomendaciones
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_fecha();

-- 10. Insertar los Roles Básicos (Para que puedas registrar usuarios sin error)
INSERT INTO public.roles (nombre) VALUES ('ADMIN'), ('AGRICULTOR') ON CONFLICT DO NOTHING;