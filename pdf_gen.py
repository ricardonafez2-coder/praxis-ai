#!/usr/bin/env python3
import os
from fpdf import FPDF

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font('Arial', '', r'C:\\Windows\\Fonts\\arial.ttf')
        self.add_font('Arial', 'B', r'C:\\Windows\\Fonts\\arialbd.ttf')
        self.add_font('Arial', 'I', r'C:\\Windows\\Fonts\\ariali.ttf')
        self.add_font('Arial', 'BI', r'C:\\Windows\\Fonts\\arialbi.ttf')
        self.add_font('Cour', '', r'C:\\Windows\\Fonts\\cour.ttf')

    def header(self):
        if self.page_no() > 1:
            self.set_font('Arial', 'I', 8)
            self.cell(0, 5, 'PRAXIS AI - Perfiles de Pacientes Virtuales - Medicina', align='C')
            self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 7)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', align='C')

    def section_title(self, title):
        self.set_fill_color(0, 51, 102)
        self.set_text_color(255, 255, 255)
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, '  ' + title, fill=True, new_x='LMARGIN', new_y='NEXT')
        self.set_text_color(0, 0, 0)
        self.ln(4)

    def subsection(self, title):
        self.set_font('Arial', 'B', 11)
        self.set_text_color(0, 51, 102)
        self.cell(0, 7, title, new_x='LMARGIN', new_y='NEXT')
        self.set_text_color(0, 0, 0)
        self.ln(1)

    def body(self, text):
        self.set_font('Arial', '', 9)
        self.multi_cell(0, 5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font('Arial', '', 9)
        self.multi_cell(0, 5, '  - ' + text)

    def code_block(self, text):
        self.set_font('Cour', '', 7.5)
        self.set_fill_color(245, 245, 245)
        self.multi_cell(0, 4, text, fill=True)
        self.ln(1)

    def separator(self):
        self.set_draw_color(0, 51, 102)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

print('PDF class ready')
