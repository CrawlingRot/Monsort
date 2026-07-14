import { useEffect, useMemo, useState } from 'react';

type HealthResponse = {
  mensaje: string;
};

type Usuario = {
  id_usuario: number;
  correo: string;
  nombre: string;
  rol: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  usuario: Usuario;
};

type Invoice = {
  id_factura: number;
  folio: string;
  rfc: string;
  cliente: string;
  fecha: string;
  banco: string;
  monto: string;
  descripcion: string;
  id_usuario: number;
  id_estado: number;
};

const API_BASE = 'http://127.0.0.1:8000';

const demoUser = {
  correo: 'diego',
  password: 'puto',
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [session, setSession] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [form, setForm] = useState({ correo: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const healthRes = await fetch(`${API_BASE}/health/`);
        const healthData = await healthRes.json();
        setHealth(healthData);

        const invoicesRes = await fetch(`${API_BASE}/facturas/`);
        if (!invoicesRes.ok) {
          throw new Error('No fue posible obtener las facturas');
        }
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (form.correo === demoUser.correo && form.password === demoUser.password) {
        const mockSession: LoginResponse = {
          access_token: 'demo-token',
          token_type: 'bearer',
          usuario: {
            id_usuario: 1,
            correo: 'diego',
            nombre: 'Diego',
            rol: 'admin',
          },
        };
        setSession(mockSession);
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + Number(invoice.monto), 0).toFixed(2);
  }, [invoices]);

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Monsort • Panel financiero</p>
          <h1>Vista general de facturas y usuarios</h1>
          <p className="hero-copy">
            Una interfaz elegante para visualizar el estado del backend y los datos principales del negocio.
          </p>
        </div>
        <div className="status-pill">
          <span className="dot" />
          {health ? health.mensaje : 'Conectando...'}
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      {!session ? (
        <section className="login-card">
          <div className="login-copy">
            <h2>Inicia sesión</h2>
            <p>Ingresa tus credenciales para ver el panel financiero.</p>
            <p className="hint">Usuario demo: diego • Contraseña: puto</p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Usuario
              <input
                type="text"
                value={form.correo}
                onChange={(event) => setForm({ ...form, correo: event.target.value })}
                placeholder="diego"
                required
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="puto"
                required
              />
            </label>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="stats-grid">
        <article className="stat-card accent-blue">
          <span>Usuarios activos</span>
          <strong>{session ? 1 : 0}</strong>
        </article>
        <article className="stat-card accent-green">
          <span>Facturas registradas</span>
          <strong>{invoices.length}</strong>
        </article>
        <article className="stat-card accent-purple">
          <span>Monto total</span>
          <strong>${total}</strong>
        </article>
      </section>

          <section className="content-grid">
            <article className="panel-card">
              <div className="panel-header">
                <h2>Sesión autenticada</h2>
                <span>Backend</span>
              </div>
              {loading ? (
                <p>Cargando...</p>
              ) : session ? (
                <div className="user-card">
                  <p><strong>Nombre:</strong> {session.usuario.nombre}</p>
                  <p><strong>Correo:</strong> {session.usuario.correo}</p>
                  <p><strong>Rol:</strong> {session.usuario.rol}</p>
                  <p><strong>Token:</strong> {session.access_token.slice(0, 20)}...</p>
                </div>
              ) : (
                <p>No se pudo autenticar.</p>
              )}
            </article>

            <article className="panel-card">
              <div className="panel-header">
                <h2>Facturas recientes</h2>
                <span>Últimas entradas</span>
              </div>
              <div className="invoice-list">
                {invoices.map((invoice) => (
                  <div className="invoice-item" key={invoice.id_factura}>
                    <div>
                      <strong>{invoice.folio}</strong>
                      <p>{invoice.cliente}</p>
                    </div>
                    <div className="invoice-meta">
                      <span>{invoice.fecha}</span>
                      <span>${invoice.monto}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
