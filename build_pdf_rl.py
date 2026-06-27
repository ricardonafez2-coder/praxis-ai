#!/usr/bin/env python3
"""Generate PDF from markdown using ReportLab with full Unicode support."""
import os, re
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Preformatted, HRFlowable
)

DARK_BLUE = HexColor('#003366')
LIGHT_BG = HexColor('#F5F5F5')
WHITE = HexColor('#FFFFFF')

def header_footer(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setFont('Helvetica-Oblique', 7)
        canvas.drawCentredString(A4[0]/2, A4[1]-20, 'PRAXIS AI - Perfiles de Pacientes Virtuales - Medicina')
    canvas.setFont('Helvetica-Oblique', 6)
    canvas.drawCentredString(A4[0]/2, 15, f'Pagina {doc.page}')
    canvas.restoreState()

def build_pdf(md_path, pdf_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle('Title1', fontSize=14, textColor=DARK_BLUE, spaceAfter=6, spaceBefore=20))
    styles.add(ParagraphStyle('Title2', fontSize=11, textColor=DARK_BLUE, spaceAfter=4, spaceBefore=10))
    styles.add(ParagraphStyle('Body9', fontSize=9, leading=13, spaceAfter=4))
    styles.add(ParagraphStyle('Bullet9', fontSize=9, leading=13, leftIndent=15, bulletIndent=5, spaceAfter=2))
    styles.add(ParagraphStyle('Code7', fontName='Courier', fontSize=7, leading=9, backColor=LIGHT_BG, leftIndent=8, spaceAfter=2))
    styles.add(ParagraphStyle('Center14', fontSize=14, alignment=TA_CENTER, spaceAfter=6))
    styles.add(ParagraphStyle('Center11', fontSize=11, alignment=TA_CENTER, textColor=HexColor('#505050'), spaceAfter=4))
    styles.add(ParagraphStyle('PortadaTitle', fontSize=22, textColor=DARK_BLUE, alignment=TA_CENTER, spaceAfter=8))
    styles.add(ParagraphStyle('Subtitle', fontSize=18, textColor=DARK_BLUE, alignment=TA_CENTER, spaceAfter=12))
    styles.add(ParagraphStyle('Center9i', fontSize=9, alignment=TA_CENTER, fontName='Helvetica-Oblique'))

    story = []

    # --- Portada ---
    story.append(Spacer(1, 60))
    story.append(Paragraph('PRAXIS AI', styles['PortadaTitle']))
    story.append(Paragraph('Simulador de Pacientes Virtuales con IA', styles['Center14']))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="60%", thickness=1, color=DARK_BLUE, spaceAfter=20))
    story.append(Paragraph('Perfiles de Pacientes - Medicina', styles['Subtitle']))
    story.append(Paragraph('9 Casos Clínicos para Configuración en Eleven Labs', styles['Center11']))
    story.append(Paragraph('Formato: Agent Configuration (Rol, Personalidad, Base de Conocimientos)', styles['Center11']))
    story.append(Spacer(1, 20))
    story.append(Paragraph('Proyecto Praxis AI - UVM Querétaro - Junio 2026', styles['Center9i']))
    story.append(PageBreak())

    i = 0
    in_code = False
    code_buf = []
    table_data = []
    in_table = False

    while i < len(lines):
        line = lines[i].rstrip()

        # Code block handling
        if line.startswith('```'):
            if in_code:
                code_text = '\n'.join(code_buf)
                story.append(Preformatted(code_text, styles['Code7']))
                code_buf = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue

        # Headings
        if line.startswith('# ') and not line.startswith('## '):
            story.append(PageBreak())
            title_text = line[2:].strip()
            # Colored title block
            tbl = Table([[Paragraph(f'<font color="white">{title_text}</font>', styles['Title1'])]],
                       colWidths=[A4[0]-40])
            tbl.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), DARK_BLUE),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(tbl)
            story.append(Spacer(1, 6))
        elif line.startswith('## '):
            story.append(Paragraph(line[3:].strip(), styles['Title2']))
        elif line.startswith('---'):
            story.append(HRFlowable(width="100%", thickness=0.5, color=DARK_BLUE, spaceAfter=10))
        elif line.startswith('- '):
            story.append(Paragraph(line[2:].strip(), styles['Bullet9']))
        elif line.startswith('|'):
            # Table row
            if not in_table:
                table_data = []
                in_table = True
            table_data.append([cell.strip() for cell in line.split('|')[1:-1]])
            # Skip separator rows
            if all(c.replace('-','').replace(':','').strip() == '' for c in table_data[-1]):
                table_data.pop()
        elif line.strip() == '':
            if in_table and table_data:
                # End table
                col_count = max(len(r) for r in table_data)
                w = (A4[0]-40) / col_count
                t = Table(table_data, colWidths=[w]*col_count)
                style_cmds = [
                    ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
                    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
                    ('FONTSIZE', (0,0), (-1,-1), 8),
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('GRID', (0,0), (-1,-1), 0.5, HexColor('#CCCCCC')),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('TOPPADDING', (0,0), (-1,-1), 3),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                ]
                for j in range(1, len(table_data)):
                    if j % 2 == 0:
                        style_cmds.append(('BACKGROUND', (0,j), (-1,j), HexColor('#F5F5FA')))
                t.setStyle(TableStyle(style_cmds))
                story.append(t)
                story.append(Spacer(1, 8))
                table_data = []
                in_table = False
            else:
                story.append(Spacer(1, 2))
        else:
            if in_table:
                pass  # Still building table
            else:
                story.append(Paragraph(line, styles['Body9']))
        i += 1

    # Build PDF
    doc = SimpleDocTemplate(
        pdf_path, pagesize=A4,
        leftMargin=20, rightMargin=20, topMargin=25, bottomMargin=20,
        title='Perfiles de Pacientes Medicina - PRAXIS AI'
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f'PDF generated: {pdf_path}')

if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))
    md_path = os.path.join(base, 'perfiles_medicina.md')
    pdf_path = os.path.join(base, 'Perfiles_Pacientes_Medicina_PRAXIS_AI.pdf')
    build_pdf(md_path, pdf_path)
