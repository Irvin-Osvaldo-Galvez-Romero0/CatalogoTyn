import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_styled_table(doc, headers, data, col_widths=None):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header Row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], '009688') # Tynor Teal
        set_cell_margins(hdr_cells[i], top=140, bottom=140, left=180, right=180)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(9.5)
            run.font.name = 'Calibri'

    # Data Rows
    for r_idx, row_data in enumerate(data):
        row_cells = table.rows[r_idx + 1].cells
        bg_color = 'F8FAFC' if r_idx % 2 == 1 else 'FFFFFF'
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=110, bottom=110, left=160, right=160)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.size = Pt(9)
                run.font.name = 'Calibri'
                if c_idx == 0:
                    run.font.bold = True
                    run.font.color.rgb = RGBColor(15, 23, 42)
                else:
                    run.font.color.rgb = RGBColor(51, 65, 85)

    # Set column widths if provided
    if col_widths:
        for row in table.rows:
            for idx, w in enumerate(col_widths):
                row.cells[idx].width = Inches(w)

    doc.add_paragraph() # Spacing after table
    return table

def add_figure(doc, img_path, caption_text, width=Inches(5.8)):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=width)

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(12)
        run_cap = p_cap.add_run(caption_text)
        run_cap.font.bold = True
        run_cap.font.italic = True
        run_cap.font.size = Pt(9)
        run_cap.font.color.rgb = RGBColor(100, 116, 139)
        run_cap.font.name = 'Calibri'
    else:
        print(f"Warning: image {img_path} not found.")

def set_document_metadata(doc):
    core_props = doc.core_properties
    core_props.title = "Manual de Usuario - Catálogo Digital Tynor Ortopedia"
    core_props.author = "Tynor Ortopedia México"
    core_props.comments = "Documentación técnica y manual operativo oficial para quioscos táctiles y dispositivos móviles."
    core_props.subject = "Manual de Operación y Administración de Catálogo"
    core_props.category = "Manual Técnico"
    core_props.keywords = "tynor, catalogo, manual, ortopedia, cotizador, qr, whatsapp"

def build_manual():
    doc = docx.Document()

    # Configure Margins (0.8 in / 2 cm)
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

        # Header
        hdr = section.header
        p_hdr = hdr.paragraphs[0]
        p_hdr.text = "Tynor Ortopedia • Manual de Usuario — Catálogo Digital Interactivo"
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        for r in p_hdr.runs:
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(148, 163, 184)
            r.font.name = 'Calibri'

        # Footer
        ftr = section.footer
        p_ftr = ftr.paragraphs[0]
        p_ftr.text = "Documentación Oficial Tynor México © 2026 • Kiosco Digital & Solución Móvil"
        p_ftr.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p_ftr.runs:
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(148, 163, 184)
            r.font.name = 'Calibri'

    # Logo Header
    logo_path = 'public/assets/logo.png'
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(6)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.8))

    # Document Title (matching Nota de Credito style)
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(2)
    run_title = p_title.add_run("Manual de Usuario — Catálogo Digital Tynor")
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.name = 'Calibri'
    run_title.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    run_sub = p_sub.add_run("Guía Operativa y de Administración para Kioscos Táctiles y Dispositivos Móviles (Versión 2.0)")
    run_sub.font.size = Pt(11)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(0, 150, 136) # Teal
    run_sub.font.name = 'Calibri'

    # ----------------------------------------------------
    # SECCIÓN 1: INTRODUCCIÓN Y RUTA DE ACCESO
    # ----------------------------------------------------
    p_sec1_title = doc.add_heading("1. Descripción General y Ruta de Acceso", level=1)
    p_sec1_title.paragraph_format.space_before = Pt(14)
    p_sec1_title.paragraph_format.space_after = Pt(6)
    for r in p_sec1_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec1_desc = doc.add_paragraph()
    p_sec1_desc.paragraph_format.space_after = Pt(8)
    p_sec1_desc.paragraph_format.line_spacing = 1.15
    p_sec1_desc.add_run(
        "Se genera una nueva solución interactiva para la exhibición, consulta clínica y cotización electrónica de productos ortopédicos y de biomecánica de la marca Tynor. Esta herramienta está diseñada para operar tanto en kioscos táctiles de punto de venta como en navegadores web y dispositivos móviles (PWA).\n\n"
        "Para ello, se establece la siguiente ruta de acceso al catálogo:"
    )

    p_route = doc.add_paragraph()
    p_route.paragraph_format.space_before = Pt(4)
    p_route.paragraph_format.space_after = Pt(10)
    run_route_label = p_route.add_run("Ruta de Acceso Web / Kiosco: ")
    run_route_label.font.bold = True
    run_route_url = p_route.add_run("Navegador --> https://catalogotyn.vercel.app")
    run_route_url.font.bold = True
    run_route_url.font.color.rgb = RGBColor(0, 150, 136)

    # Fig. 1
    add_figure(doc, 'docs/screenshots/fig1_catalogo_principal.png', 'Fig. 1. Pantalla Principal del Catálogo Oficial Tynor', width=Inches(5.8))

    doc.add_paragraph("Una vez se realice el acceso al sistema, se mostrará la pantalla principal ilustrada en la Figura 1, la cual contiene los siguientes elementos operativos:")

    table1_headers = ["Item", "Descripción"]
    table1_data = [
        ["Identidad Corporativa (Logo)", "Ubicado en el margen superior izquierdo. Muestra el logotipo oficial Tynor y resguarda el trigger táctil oculto de acceso al Panel de Administración."],
        ["Selector de Vistas (Tabs)", "Permite alternar entre la vista de 'Catálogo' general y el modelo anatómico 'Cuerpo 3D' con un solo toque."],
        ["Buscador Inteligente", "Barra predictiva con teclado en pantalla integrado que filtra instantáneamente por código SKU (ej. L03, 101, A01), nombre comercial o término clínico."],
        ["Píldoras de Categorías", "Barra de filtros horizontales con categorías como Inmovilizadores, Rodilleras, Tobillo, Cuello, Columna/Lumbar, etc."],
        ["Tarjeta de Producto (Card)", "Presenta la fotografía clínica del artículo, código de referencia, marca, línea, tallas disponibles, precio oficial 2026 y botón '+ Agregar' directo."],
        ["Botón Modo Demo (Play)", "Inicia la secuencia de demostración interactiva / salvapantallas para exposiciones y puntos de venta."],
        ["Botón Lista de Deseos", "Icono de marcador en la esquina superior derecha que despliega el cajón lateral con el pedido acumulado y cotización."]
    ]
    create_styled_table(doc, table1_headers, table1_data, col_widths=[1.8, 4.4])

    # ----------------------------------------------------
    # SECCIÓN 2: EXPLORACIÓN Y CUERPO ANATÓMICO 3D
    # ----------------------------------------------------
    p_sec2_title = doc.add_heading("2. Exploración Clínica y Filtro Anatómico 3D", level=1)
    p_sec2_title.paragraph_format.space_before = Pt(14)
    p_sec2_title.paragraph_format.space_after = Pt(6)
    for r in p_sec2_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec2_desc = doc.add_paragraph(
        "Al pulsar la pestaña 'Cuerpo 3D' en la barra superior, el sistema despliega el modelo anatómico humano interactivo. Esta función permite a médicos, fisioterapeutas y clientes localizar soluciones ortopédicas de acuerdo con la zona anatómica o articulación afectada."
    )

    add_figure(doc, 'docs/screenshots/fig2_anatomia_3d.png', 'Fig. 2. Vista de Selección Anatómica 3D', width=Inches(5.8))

    doc.add_paragraph("La vista anatómica tridimensional cuenta con los siguientes componentes:")

    table2_headers = ["Item", "Descripción"]
    table2_data = [
        ["Modelo Anatómico Humano", "Representación gráfica tridimensional que modela la estructura músculo-esquelética de cuerpo completo."],
        ["Puntos de Interacción (Hotspots)", "Zonas activas táctiles situadas en: Cuello/Cervical, Hombro/Brazo, Muñeca/Mano, Columna/Lumbar, Rodilla y Tobillo/Pie."],
        ["Filtrado Articular Inmediato", "Al tocar un punto anatómico, el sistema filtra de manera automática todos los productos ortopédicos diseñados específicamente para dicha articulación."],
        ["Botón Volver al Catálogo", "Permite regresar a la cuadrícula general de productos conservando las selecciones y preferencias establecidas."]
    ]
    create_styled_table(doc, table2_headers, table2_data, col_widths=[1.8, 4.4])

    # ----------------------------------------------------
    # SECCIÓN 3: CONFIGURADOR DE MEDIDAS Y PRECIOS POR TALLA
    # ----------------------------------------------------
    p_sec3_title = doc.add_heading("3. Ficha Técnica y Configurador de Medidas / Variantes", level=1)
    p_sec3_title.paragraph_format.space_before = Pt(14)
    p_sec3_title.paragraph_format.space_after = Pt(6)
    for r in p_sec3_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec3_desc = doc.add_paragraph(
        "Al seleccionar cualquier producto de la rejilla, se abre la ventana modal de detalle clínico. En esta sección se configuran las combinaciones de tallas, colores y número de piezas requeridas, calculándose el costo de forma dinámica según las tarifas oficiales 2026."
    )

    add_figure(doc, 'docs/screenshots/fig3_detalle_producto.png', 'Fig. 3. Ficha Técnica y Configurador de Variantes por Medida', width=Inches(5.8))

    doc.add_paragraph("Los controles y elementos disponibles en la ficha de producto se detallan a continuación:")

    table3_headers = ["Item", "Descripción"]
    table3_data = [
        ["Encabezado y Código SKU", "Muestra el código oficial (ej. L03), marca (Tynor / Athlon / Medivaric) y categoría clínica."],
        ["Visualizador de Precios Dinámicos", "Muestra el importe del producto. Si el artículo posee precios diferenciados por talla (ej. CH|M|G a $225 y XL|XXL a $240), el precio se actualiza en tiempo real al tocar cada medida."],
        ["Selector de Medida / Talla", "Botones ergonómicos táctiles con indicador de costo individual cuando la talla posee una tarifa especial."],
        ["Selector de Color (Línea AIR PRO)", "Opciones cromáticas (ej. Naranja Neón, Verde Neón, Gris o Negro) con muestra visual de color."],
        ["Contador de Piezas (+ / -)", "Controles rápidos para definir la cantidad exacta de unidades para la combinación seleccionada."],
        ["Botón '+ Agregar Combinación'", "Añade la combinación específica (talla + color + piezas) al listado de variantes de la cotización."],
        ["Lista de Combinaciones Agregadas", "Muestra el resumen de todas las variantes añadidas con botones para ajustar cantidad o eliminar filas individuales."],
        ["Subtotal Dinámico del Producto", "Cálculo matemático en tiempo real que multiplica cada variante por su tarifa de medida correspondiente."],
        ["Descripción Clínica y Usos", "Detalle de indicaciones médicas, certificaciones y propiedades biomecánicas del dispositivo."],
        ["Botón 'Ficha Técnica PDF'", "Abre y permite consultar el documento técnico en PDF oficial avalado por el fabricante."],
        ["Botón 'Agregar a cotización'", "Consolida las combinaciones seleccionadas y las envía al cajón de Mi Lista de Deseos."]
    ]
    create_styled_table(doc, table3_headers, table3_data, col_widths=[1.8, 4.4])

    # ----------------------------------------------------
    # SECCIÓN 4: LISTA DE DESEOS Y COTIZADOR
    # ----------------------------------------------------
    p_sec4_title = doc.add_heading("4. Cajón 'Mi Lista de Deseos' y Precotización", level=1)
    p_sec4_title.paragraph_format.space_before = Pt(14)
    p_sec4_title.paragraph_format.space_after = Pt(6)
    for r in p_sec4_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec4_desc = doc.add_paragraph(
        "Al tocar el botón de marcador en la barra superior, se despliega el cajón lateral 'Mi Lista de Deseos'. En este panel se agrupan todos los modelos seleccionados, el desglose pormenorizado de variantes y el cálculo total del pedido."
    )

    add_figure(doc, 'docs/screenshots/fig4_lista_deseos.png', 'Fig. 4. Cajón Lateral "Mi Lista de Deseos"', width=Inches(5.8))

    doc.add_paragraph("La lista de deseos cuenta con los siguientes campos y acciones:")

    table4_headers = ["Item", "Descripción"]
    table4_data = [
        ["Total de Artículos y Modelos", "Conteo total de piezas acumuladas y número de modelos distintos en el pedido."],
        ["Suma Total Estimada", "Monto consolidado en Pesos Mexicanos (MXN) calculado con base en las tarifas oficiales 2026 por talla."],
        ["Desglose por Producto", "Tarjeta por cada artículo con fotografía, código, nombre y bloque de variantes solicitadas."],
        ["Selector de Asesor Comercial", "Menú desplegable para fijar o seleccionar el asesor comercial responsable que atenderá la cotización."],
        ["Botón 'Enviar Pedido a WhatsApp'", "Cierra automáticamente el drawer y abre el código QR para transferir la cotización al celular."],
        ["Botón 'Mandar a Correo'", "Abre el diálogo para remitir la cotización vía correo electrónico institucional al cliente y al asesor."],
        ["Botón 'Vaciar Lista'", "Limpia la totalidad de los artículos de la lista de deseos para comenzar una nueva cotización."]
    ]
    create_styled_table(doc, table4_headers, table4_data, col_widths=[1.8, 4.4])

    # ----------------------------------------------------
    # SECCIÓN 5: CÓDIGO QR Y TRANSFERENCIA MÓVIL
    # ----------------------------------------------------
    p_sec5_title = doc.add_heading("5. Generación de Código QR y Auto-Descarga Móvil", level=1)
    p_sec5_title.paragraph_format.space_before = Pt(14)
    p_sec5_title.paragraph_format.space_after = Pt(6)
    for r in p_sec5_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec5_desc = doc.add_paragraph(
        "Al pulsar el botón 'Enviar Pedido a WhatsApp', el sistema oculta el drawer y genera un Código QR interactivo en el centro de la pantalla. El cliente únicamente debe escanear el código con la cámara de su teléfono inteligente para recibir el documento oficial sin requerir impresiones en papel."
    )

    add_figure(doc, 'docs/screenshots/fig5_codigo_qr.png', 'Fig. 5. Código QR Interactivo para Celular y WhatsApp', width=Inches(5.4))

    doc.add_paragraph("Los elementos presentes en el diálogo de Código QR son:")

    table5_headers = ["Item", "Descripción"]
    table5_data = [
        ["Código QR Dinámico", "Generado en alta resolución. Contiene los parámetros encriptados de la cotización completa."],
        ["Insignia 'Auto-Descarga PDF en tu Celular'", "Aviso visual que garantiza que el archivo oficial se descargará de forma inmediata en el teléfono."],
        ["Asesor Asignado", "Muestra el nombre completo y teléfono del asesor de ventas al cual se enviará el pedido."],
        ["Instrucciones Paso a Paso", "Indicaciones concisas para abrir la cámara de cualquier celular (iOS o Android) y vincular la orden."]
    ]
    create_styled_table(doc, table5_headers, table5_data, col_widths=[1.8, 4.4])

    # ----------------------------------------------------
    # SECCIÓN 6: VISTA DEL CLIENTE EN SMARTPHONE
    # ----------------------------------------------------
    p_sec6_title = doc.add_heading("6. Experiencia del Cliente en Smartphone y Envío a WhatsApp", level=1)
    p_sec6_title.paragraph_format.space_before = Pt(14)
    p_sec6_title.paragraph_format.space_after = Pt(6)
    for r in p_sec6_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec6_desc = doc.add_paragraph(
        "Una vez escaneado el código QR, el dispositivo móvil del cliente abre de forma automática la página de cotización personalizada. En segundo plano, se fuerza la descarga nativa del PDF oficial con membrete institucional, evitando bloqueos de visualización en navegadores móviles (Safari iOS / Chrome Android)."
    )

    add_figure(doc, 'docs/screenshots/fig9_vista_movil.png', 'Fig. 6. Vista del Cliente en Celular y Descarga de Cotización', width=Inches(3.2))

    doc.add_paragraph("La interfaz móvil para el cliente ofrece las siguientes funciones:")

    table6_headers = ["Item", "Descripción"]
    table6_data = [
        ["Estado de Descarga", "Aviso en vivo confirmando que el PDF oficial se ha guardado en la carpeta de descargas del dispositivo."],
        ["Resumen Comercial", "Presenta el asesor responsable, cantidad total de piezas e importe global estimado."],
        ["Desglose de Variantes", "Lista limpia de las piezas cotizadas especificando medida (talla) y color."],
        ["Botón 'Enviar Precotización por WhatsApp'", "Abre la aplicación WhatsApp en el móvil con el chat directo del asesor y un saludo formal pre-redactado para adjuntar el PDF descargado."],
        ["Botón 'Descargar PDF ahora'", "Disparador de respaldo en caso de que el navegador del cliente tenga bloqueadas las descargas automáticas."]
    ]
    create_styled_table(doc, table6_headers, table6_data, col_widths=[1.8, 4.4])

    # ----------------------------------------------------
    # SECCIÓN 7: MODO DEMOSTRACIÓN (SCREEN SAVER)
    # ----------------------------------------------------
    p_sec7_title = doc.add_heading("7. Modo Demostración de Pantalla (Attract Mode)", level=1)
    p_sec7_title.paragraph_format.space_before = Pt(14)
    p_sec7_title.paragraph_format.space_after = Pt(6)
    for r in p_sec7_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec7_desc = doc.add_paragraph(
        "El sistema cuenta con un Modo Demostración de Pantalla diseñado para stands de exhibición, congresos médicos y tiendas comerciales. Puede iniciarse manualmente tocando el botón 'Play' en la barra superior o configurarse para activarse automáticamente tras un periodo de inactividad."
    )

    add_figure(doc, 'docs/screenshots/fig8_modo_demostracion.png', 'Fig. 7. Modo Demostración de Pantalla Interactivo', width=Inches(5.8))

    doc.add_paragraph("Características del Modo Demostración:")

    table7_headers = ["Item", "Descripción"]
    table7_data = [
        ["Rotación de Banners Institucionales", "Exhibe gráficos de alta calidad con las líneas Tynor Ortopedia, Deportiva, Athlon y Medivaric."],
        ["Productos Destacados en Vivo", "Muestra carruseles con dispositivos ortopédicos estrella y especificaciones clave."],
        ["Reactivación al Toque", "Al tocar cualquier parte de la pantalla, el sistema abandona el salvapantallas y regresa instantáneamente al catálogo."]
    ]
    create_styled_table(doc, table7_headers, table7_data, col_widths=[1.8, 4.4])

    # ----------------------------------------------------
    # SECCIÓN 8: PANEL DE ADMINISTRACIÓN Y CONFIGURACIÓN
    # ----------------------------------------------------
    p_sec8_title = doc.add_heading("8. Panel de Administración y Configuración Centralizada", level=1)
    p_sec8_title.paragraph_format.space_before = Pt(14)
    p_sec8_title.paragraph_format.space_after = Pt(6)
    for r in p_sec8_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    p_sec8_desc = doc.add_paragraph(
        "El catálogo cuenta con un Panel de Administración protegido por credenciales para la gestión técnica, catálogo de productos, personalización visual y configuración de pasarelas de correo.\n\n"
        "Ruta de Acceso Administrativo:\n"
        "Para acceder, realice un triple clic rápido (3 pulsaciones) sobre el logotipo Tynor en la barra superior izquierda. Se desplegará la ventana de autenticación mostrada en la Figura 8."
    )

    add_figure(doc, 'docs/screenshots/fig6_login_admin.png', 'Fig. 8. Ventana de Autenticación de Administrador (NIP)', width=Inches(4.5))

    doc.add_paragraph(
        "Ingrese el Usuario ('admin') y el NIP maestro asignado (por defecto '2026'). Al validar las credenciales, se abrirá el Panel de Control en pantalla completa ilustrado en la Figura 9:"
    )

    add_figure(doc, 'docs/screenshots/fig7_panel_administracion.png', 'Fig. 9. Panel Central de Control Administrativo', width=Inches(5.8))

    doc.add_paragraph("El Panel de Administración se estructura en 4 módulos principales:")

    table8_headers = ["Módulo / Pestaña", "Funcionalidades Principales"]
    table8_data = [
        ["Pestaña Productos", "Listado y buscador de los 180 productos. Permite agregar nuevos artículos, modificar información clínica, cargar fichas técnicas PDF, definir stock y ajustar precios."],
        ["Editor de Precios por Talla (priceBySize)", "Herramienta integrada que detecta automáticamente las tallas ingresadas y permite fijar tarifas diferenciadas por medida (ej. XL o XXL con sobreprecio) o retornar al precio base con un clic."],
        ["Pestaña Branding & Logo", "Personalización en tiempo real del logotipo institucional y de la paleta de color principal sin requerir reinicio del servidor."],
        ["Pestaña Correo Emisor", "Configuración centralizada de pasarela SMTP (presets para Gmail, Outlook 365 o Dominio Propio/HostGator) y herramienta de prueba de envío en vivo."],
        ["Pestaña Seguridad NIP", "Permite actualizar el nombre de usuario y el NIP de autorización de 4 o más dígitos."]
    ]
    create_styled_table(doc, table8_headers, table8_data, col_widths=[2.0, 4.2])

    # ----------------------------------------------------
    # SECCIÓN 9: SOPORTE Y PREGUNTAS FRECUENTES
    # ----------------------------------------------------
    p_sec9_title = doc.add_heading("9. Preguntas Frecuentes y Soporte Técnico", level=1)
    p_sec9_title.paragraph_format.space_before = Pt(14)
    p_sec9_title.paragraph_format.space_after = Pt(6)
    for r in p_sec9_title.runs:
        r.font.color.rgb = RGBColor(15, 23, 42)
        r.font.size = Pt(13)

    table9_headers = ["Situación / Pregunta", "Solución / Procedimiento Recomendado"]
    table9_data = [
        ["¿Cómo actualizo el precio de un producto que tiene diferente tarifa por medida?", "Ingrese al Panel de Administrador con el NIP 2026, busque el código del producto, pulse 'Editar' y en la sección 'Precios Específicos por Medida / Talla' capture el importe de cada talla."],
        ["¿Qué sucede si un cliente no tiene lector de QR?", "El cliente puede abrir el navegador en su smartphone y teclear el enlace directo o el asesor puede seleccionar la opción 'Mandar a Correo' desde la lista de deseos."],
        ["¿Cómo se garantiza que el quiosco funcione sin conexión a internet?", "El sistema está construido como Progressive Web App (PWA) con Service Worker activo. La totalidad del catálogo de 180 productos y las imágenes se almacenan en caché local para navegación continua."],
        ["¿Dónde se contacta a soporte técnico?", "Para asistencia técnica, actualización de listas de precios o soporte de infraestructura, comuníquese con el Departamento de TI de Mexortho / Tynor México."]
    ]
    create_styled_table(doc, table9_headers, table9_data, col_widths=[2.0, 4.2])

    # Final signature box
    p_sign = doc.add_paragraph()
    p_sign.paragraph_format.space_before = Pt(16)
    p_sign.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sign1 = p_sign.add_run("Tynor Ortopedia México — Dirección de Tecnología y Operaciones Comerciales\n")
    run_sign1.font.bold = True
    run_sign1.font.size = Pt(10)
    run_sign1.font.color.rgb = RGBColor(15, 23, 42)
    run_sign2 = p_sign.add_run("Catálogo Médico Digital v2.0 • Todos los derechos reservados © 2026")
    run_sign2.font.italic = True
    run_sign2.font.size = Pt(8.5)
    run_sign2.font.color.rgb = RGBColor(100, 116, 139)

    # Clean metadata (remove AI marks Layer A / clean container)
    set_document_metadata(doc)

    out_path = 'docs/TynorManuales.docx'
    doc.save(out_path)
    print(f"Manual successfully generated and saved to {out_path}!")

if __name__ == '__main__':
    build_manual()
