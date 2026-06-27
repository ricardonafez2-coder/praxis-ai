#!/usr/bin/env python3
import os, re
from fpdf import FPDF

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font('Arial', '', r'C:\Windows\Fonts\arial.ttf')
        self.add_font('Arial', 'B', r'C:\Windows\Fonts\arialbd.ttf')
        self.add_font('Arial', 'I', r'C:\Windows\Fonts\ariali.ttf')
        self.add_font('Cour', '', r'C:\Windows\Fonts\cour.ttf')
    def header(self):
        if self.page_no() > 1:
            self.set_font('Arial', 'I', 8)
            self.cell(0, 5, 'PRAXIS AI - Perfiles de Pacientes Virtuales - Medicina', align='C')
            self.ln(8)
    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 7)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', align='C')
    def title_block(self, text, level=1):
        if level == 1:
            self.set_fill_color(0, 51, 102)
            self.set_text_color(255, 255, 255)
            self.set_font('Arial', 'B', 14)
            self.cell(0, 10, '  '+text, fill=True, new_x='LMARGIN', new_y='NEXT')
            self.set_text_color(0, 0, 0)
        elif level == 2:
            self.set_font('Arial', 'B', 11)
            self.set_text_color(0, 51, 102)
            self.cell(0, 7, text, new_x='LMARGIN', new_y='NEXT')
            self.set_text_color(0, 0, 0)
        self.ln(2)
    def para(self, text):
        self.set_font('Arial', '', 9)
        self.multi_cell(0, 5, text)
        self.ln(0.5)
    def bullet(self, text):
        self.set_font('Arial', '', 9)
        self.multi_cell(0, 5, '  - '+text)
    def code(self, text):
        self.set_font('Cour', '', 7)
        self.set_fill_color(245, 245, 245)
        self.multi_cell(0, 3.8, text, fill=True)
        self.ln(1)
    def sep(self):
        self.set_draw_color(0, 51, 102)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

def process_md(pdf, path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    i = 0
    in_code = False
    code_buf = []
    while i < len(lines):
        line = lines[i].rstrip()
        if line.startswith('`'):
            if in_code:
                pdf.code('\n'.join(code_buf))
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
        if line.startswith('# ') and not line.startswith('## '):
            pdf.add_page()
            pdf.title_block(line[2:], 1)
        elif line.startswith('## '):
            pdf.title_block(line[3:], 2)
        elif line.startswith('---'):
            pdf.sep()
        elif line.startswith('- '):
            pdf.bullet(line[2:])
        elif line.strip() == '':
            pdf.ln(1)
        else:
            pdf.para(line)
        i += 1

base = os.path.dirname(os.path.abspath(__file__))
md_path = os.path.join(base, 'perfiles_medicina.md')
pdf_path = os.path.join(base, 'Perfiles_Pacientes_Medicina_PRAXIS_AI.pdf')

pdf = PDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)
process_md(pdf, md_path)
pdf.output(pdf_path)
print(f'PDF generated: {pdf_path}')
