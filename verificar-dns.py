#!/usr/bin/env python3
"""
Verifica os registos de autenticação de e-mail do domínio.

    python verificar-dns.py

Não precisa de instalar nada: usa o nslookup do sistema. Corre-se depois de
criar os registos no painel do Cloudflare, para confirmar que ficaram certos.
A propagação costuma demorar 1 a 5 minutos.
"""

import re
import subprocess
import sys

DOMINIO = 'renovaenergylda.co.mz'
RESOLVER = '1.1.1.1'   # resolver público, para não apanhar cache do ISP

# A consola do Windows nem sempre entende cor nem UTF-8. Sem isto, o relatório
# sai com os códigos em cru ("[31m") e os acentos partidos.
if sys.platform == 'win32':
    try:
        import ctypes
        k = ctypes.windll.kernel32
        k.SetConsoleOutputCP(65001)                   # UTF-8
        k.SetConsoleMode(k.GetStdHandle(-11), 7)      # activa sequências ANSI
    except Exception:
        pass
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

_cor = sys.stdout.isatty()
VERDE, VERMELHO, AMARELO, CINZA, FIM = (
    ('\033[32m', '\033[31m', '\033[33m', '\033[90m', '\033[0m')
    if _cor else ('', '', '', '', ''))


def consultar(tipo, nome):
    """Devolve a lista de valores encontrados para um registo."""
    try:
        r = subprocess.run(
            ['nslookup', '-type=' + tipo, nome, RESOLVER],
            capture_output=True, text=True, timeout=20,
            encoding='utf-8', errors='replace')
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return None

    saida = r.stdout or ''
    if tipo == 'TXT':
        # nslookup parte cadeias longas por várias linhas
        return [v.strip('" ') for v in re.findall(r'text\s*=\s*"?([^"\n]+)', saida)]
    if tipo == 'MX':
        return [m.strip() for m in re.findall(
            r'mail exchanger\s*=\s*(.+)', saida)]
    return []


def resultado(ok, etiqueta, detalhe=''):
    marca = ('%sOK   %s' % (VERDE, FIM)) if ok else ('%sFALTA%s' % (VERMELHO, FIM))
    print('  [%s] %-38s %s%s%s' % (marca, etiqueta, CINZA, detalhe, FIM))
    return ok


def main():
    print('\nAutenticação de e-mail — %s\n' % DOMINIO)

    tudo = []

    # --- SPF ---------------------------------------------------------------
    txts = consultar('TXT', DOMINIO) or []
    spf = next((t for t in txts if t.lower().startswith('v=spf1')), None)
    if spf is None:
        tudo.append(resultado(False, 'SPF', 'nenhum registo v=spf1 no apex'))
    elif '-all' in spf:
        tudo.append(resultado(True, 'SPF', spf))
    else:
        tudo.append(resultado(False, 'SPF', 'existe mas não termina em -all: ' + spf))

    if len([t for t in txts if t.lower().startswith('v=spf1')]) > 1:
        print('  %s!%s  Há mais do que um SPF. Isso invalida os dois; tem de ser só um.'
              % (AMARELO, FIM))

    # --- DKIM --------------------------------------------------------------
    dkim = consultar('TXT', '*._domainkey.' + DOMINIO) or []
    chave = next((t for t in dkim if 'v=dkim1' in t.lower()), None)
    tudo.append(resultado(
        chave is not None, 'DKIM (curinga revogado)',
        chave or 'nenhum registo em *._domainkey'))

    # --- DMARC -------------------------------------------------------------
    dm = consultar('TXT', '_dmarc.' + DOMINIO) or []
    pol = next((t for t in dm if t.lower().startswith('v=dmarc1')), None)
    if pol is None:
        tudo.append(resultado(False, 'DMARC', 'nenhum registo em _dmarc'))
    else:
        modo = re.search(r'p\s*=\s*(\w+)', pol)
        modo = modo.group(1) if modo else '?'
        tudo.append(resultado(modo == 'reject', 'DMARC', pol))
        if modo in ('none', 'quarantine'):
            print('  %s!%s  p=%s ainda não rejeita. Para um domínio que não envia '
                  'e-mail, o correto é p=reject.' % (AMARELO, FIM, modo))
        # Armadilha da RFC 7489 §7.1
        rua = re.search(r'rua\s*=\s*mailto:([^;,\s]+)', pol)
        if rua and not rua.group(1).endswith('@' + DOMINIO):
            externo = rua.group(1).split('@')[-1]
            auth = consultar('TXT', '%s._report._dmarc.%s' % (DOMINIO, externo)) or []
            if not auth:
                print('  %s!%s  O rua aponta para @%s, que não autoriza receber '
                      'estes relatórios.\n      Faltaria %s._report._dmarc.%s no '
                      'DNS *desse* domínio.\n      Como está, nunca chega relatório '
                      'nenhum. Ver LANCAMENTO.md 3.2.'
                      % (AMARELO, FIM, externo, DOMINIO, externo))

    # --- MX ----------------------------------------------------------------
    mx = consultar('MX', DOMINIO) or []
    nulo = any(m.rstrip('.') in ('', '0') or m.strip() in ('.', '0 .') for m in mx)
    if not mx:
        tudo.append(resultado(False, 'MX nulo (RFC 7505)', 'não há MX nenhum'))
        print('  %s!%s  Sem MX o domínio já não recebe e-mail, mas o MX nulo diz '
              'isso\n      explicitamente e faz o remetente falhar logo.'
              % (AMARELO, FIM))
    else:
        tudo.append(resultado(nulo, 'MX nulo (RFC 7505)', ', '.join(mx)))

    # --- Resumo ------------------------------------------------------------
    faltam = tudo.count(False)
    print()
    if faltam == 0:
        print('  %sO domínio está fechado a falsificação.%s\n' % (VERDE, FIM))
        return 0
    print('  %s%d de %d por resolver.%s Valores exactos em LANCAMENTO.md, 3.2.\n'
          % (VERMELHO, faltam, len(tudo), FIM))
    return 1


if __name__ == '__main__':
    sys.exit(main())
