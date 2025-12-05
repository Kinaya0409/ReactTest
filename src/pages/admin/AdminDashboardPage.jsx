import React, { useEffect, useState } from "react"; 
import { Container, Row, Col, Card } from "react-bootstrap";
import { apiFetch } from "../../api/api.js";
import TopNavbar from "../../components/TopNavbar.jsx";

const AdminDashboardPage = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const adminNavRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const lay = await apiFetch("/layanan/read");
        setServices(lay || []);

        const pem = await apiFetch("/pemesanan/read");
        setBookings(pem || []);

        const peg = await apiFetch("/pegawai/read");
        setStylists(peg || []);

        
        const payments = await apiFetch("/pembayaran/read");
        const pemesanan = await apiFetch("/pemesanan/read");

        console.log("=== DEBUG PEMBAYARAN ===");
        console.log("Data Pembayaran:", payments);
        console.log("Data Pemesanan:", pemesanan);

        let total = 0;
        payments.forEach((pay) => {
          
          const pesanan = pemesanan.find(p => p.id_pemesanan === pay.id_pemesanan);
          
          if (pesanan && pesanan.layanan) {
            const harga = Number(pesanan.layanan.harga || 0);
            console.log("ID Pemesanan:", pay.id_pemesanan, "| Harga Layanan:", harga);
            total += harga;
          }
        });

        console.log("Total Revenue Akhir:", total);
        setRevenue(total);

      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <>
      <TopNavbar routes={adminNavRoutes} />
 
      <Container style={{ paddingTop: "100px" }}>
        <h1 className="mb-4">Admin Dashboard</h1>

        <Row className="g-3">
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <h5>Layanan</h5>
              <div className="display-6">{services.length}</div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <h5>Pesanan</h5>
              <div className="display-6">{bookings.length}</div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <h5>Pegawai</h5>
              <div className="display-6">{stylists.length}</div>
            </Card>
          </Col>

          {/* CARD TOTAL PENDAPATAN */}
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <h5>Total Pendapatan</h5>
              <div className="display-6">
                Rp {Number(revenue).toLocaleString("id-ID")}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboardPage; 