from fpdf import FPDF
import os

pdf = FPDF()
pdf.add_page()
pdf.add_font('Arial', '', r'C:\Windows\Fonts\arial.ttf')
pdf.set_font('Arial', '', 9)

tests = [
    'Test normal text',
    'Test with accented chars: áéíóú ñ ü',
    'Test with long text that needs wrapping: ' + 'hello ' * 50,
    'Test with dashes: -- and ---',
    'Test with bullet char unicode',
    'Test - Minimizacion y Aguante: Al principio, respondes restandole importancia',
]
for i, t in enumerate(tests):
    try:
        result = f'  - {t}'
        print(f'Test {i}: length={len(result)}, first 80 chars: {result[:80]}')
        pdf.multi_cell(0, 5, result)
        print(f'  OK - y pos after: {pdf.get_y()}')
    except Exception as e:
        print(f'  FAILED: {e}')

pdf.output('debug_font.pdf')
print('Done')
