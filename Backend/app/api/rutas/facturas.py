from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["Facturas"])
def listar_facturas():
    return [
        {
            "id_factura": 1,
            "folio": "F-1001",
            "rfc": "ABC123456789",
            "cliente": "Grupo Norte",
            "fecha": "2026-07-01",
            "banco": "Banorte",
            "monto": "12500.00",
            "descripcion": "Factura de servicios",
            "id_usuario": 1,
            "id_estado": 1,
        },
        {
            "id_factura": 2,
            "folio": "F-1002",
            "rfc": "XYZ987654321",
            "cliente": "Muebles del Sur",
            "fecha": "2026-07-08",
            "banco": "BBVA",
            "monto": "8400.50",
            "descripcion": "Compra de insumos",
            "id_usuario": 1,
            "id_estado": 2,
        },
    ]
