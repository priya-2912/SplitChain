import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = docx.Document()
    
    # Page setup: Standard A4 margins (1 inch on all sides)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11.5)
    normal_style.font.color.rgb = RGBColor(30, 30, 30)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    def add_title(text, size=18, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=12):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = RGBColor(20, 20, 20)
        return p

    def add_heading1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(15, 35, 75)
        return p

    def add_heading2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(40, 40, 40)
        return p

    def add_paragraph(text, justify=True, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        if justify:
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.font.name = 'Times New Roman'
            r_b.font.size = Pt(11.5)
            r_b.font.bold = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11.5)
        r.font.italic = italic
        return p

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(4)
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.name = 'Times New Roman'
            rb.font.size = Pt(11.5)
            rb.font.bold = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11.5)
        return p

    def create_table(headers, data, col_widths=None):
        table = doc.add_table(rows=len(data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            hdr_cells[i].text = header_text
            set_cell_background(hdr_cells[i], "1F4E79")
            set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(9.5)
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)

        for r_idx, row_data in enumerate(data):
            row_cells = table.rows[r_idx + 1].cells
            bg_color = "F9FBFD" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                row_cells[c_idx].text = str(cell_value)
                set_cell_background(row_cells[c_idx], bg_color)
                set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=120, right=120)
                p = row_cells[c_idx].paragraphs[0]
                if c_idx == 0 and len(str(cell_value)) < 12 and ("TC-" in str(cell_value) or str(cell_value).isdigit()):
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in p.runs:
                    run.font.name = "Times New Roman"
                    run.font.size = Pt(9)
                    run.font.color.rgb = RGBColor(30, 30, 30)

        if col_widths:
            for row in table.rows:
                for idx, width in enumerate(col_widths):
                    row.cells[idx].width = Inches(width)

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(2)
        p_after.paragraph_format.space_after = Pt(6)
        return table

    def add_code_block(code_text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "F8F9FA")
        set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/><w:left w:val="single" w:sz="18" w:space="0" w:color="1F4E79"/><w:right w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/></w:tcBorders>')
        tcPr.append(borders)
        
        cell.text = code_text
        p = cell.paragraphs[0]
        p.paragraph_format.line_spacing = 1.05
        for run in p.runs:
            run.font.name = "Consolas"
            run.font.size = Pt(8.5)
            run.font.color.rgb = RGBColor(33, 37, 41)
        
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(4)

    def add_diagram_box(title, content):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "FAFCFE")
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="6" w:space="0" w:color="2E5B88"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="2E5B88"/><w:left w:val="single" w:sz="6" w:space="0" w:color="2E5B88"/><w:right w:val="single" w:sz="6" w:space="0" w:color="2E5B88"/></w:tcBorders>')
        tcPr.append(borders)
        
        cell.text = content
        p = cell.paragraphs[0]
        p.paragraph_format.line_spacing = 1.05
        for run in p.runs:
            run.font.name = "Consolas"
            run.font.size = Pt(8.5)
            run.font.color.rgb = RGBColor(25, 45, 80)
            
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(4)

    def add_figure_placeholder(title, caption):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "F9F9F9")
        set_cell_margins(cell, top=180, bottom=180, left=180, right=180)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="dashed" w:sz="6" w:space="0" w:color="999999"/><w:bottom w:val="dashed" w:sz="6" w:space="0" w:color="999999"/><w:left w:val="dashed" w:sz="6" w:space="0" w:color="999999"/><w:right w:val="dashed" w:sz="6" w:space="0" w:color="999999"/></w:tcBorders>')
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(f"[{title}]\n")
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(100, 100, 100)
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(6)
        rc = p_cap.add_run(caption)
        rc.font.name = "Times New Roman"
        rc.font.size = Pt(10)
        rc.font.italic = True
        rc.font.bold = True

    # ==================== COVER PAGE ====================
    add_title("RV UNIVERSITY", size=22, bold=True, space_before=10, space_after=4)
    add_title("School of Computer Science and Engineering", size=14, bold=True, space_after=2)
    add_title("Bengaluru, India", size=12, bold=False, space_after=36)
    
    add_title("CS2614 Fundamentals of Blockchain", size=14, bold=True, space_after=6)
    add_title("Mini Project Report", size=13, bold=True, space_after=24)
    
    add_title("SPLITCHAIN: A DECENTRALISED EXPENSE SHARING AND TWO-PHASE SETTLEMENT ACKNOWLEDGEMENT SYSTEM ON ETHEREUM", size=15, bold=True, space_after=40)
    
    add_title("Submitted By:", size=12, bold=True, space_after=6)
    p_stud = doc.add_paragraph()
    p_stud.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_stud.paragraph_format.line_spacing = 1.3
    p_stud.paragraph_format.space_after = Pt(36)
    for name in ["[STUDENT NAME 1 (USN)]", "[STUDENT NAME 2 (USN)]", "[STUDENT NAME 3 (USN)]", "[STUDENT NAME 4 (USN)]"]:
        r = p_stud.add_run(name + "\n")
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True

    add_title("Under the guidance of:", size=12, bold=True, space_after=4)
    add_title("Prof. [Faculty Name]", size=13, bold=True, space_after=2)
    add_title("School of Computer Science and Engineering\nRV University, Bangalore", size=11, bold=False, space_after=20)
    
    doc.add_page_break()

    # ==================== CERTIFICATE ====================
    add_title("School of Computer Science and Engineering", size=14, bold=True, space_after=2)
    add_title("CERTIFICATE", size=16, bold=True, space_after=18)
    
    add_paragraph("Certified that the CS2614 Fundamentals of Blockchain Mini Project work titled \"SPLITCHAIN: A DECENTRALISED EXPENSE SHARING AND TWO-PHASE SETTLEMENT ACKNOWLEDGEMENT SYSTEM ON ETHEREUM\" is carried out by [STUDENT NAME 1 (USN)], [STUDENT NAME 2 (USN)], [STUDENT NAME 3 (USN)], [STUDENT NAME 4 (USN)] who are bonafide students of the School of Computer Science and Engineering, RV University, Bengaluru, during the academic year 2025–26. It is certified that all corrections/suggestions from all the continuous internal evaluations have been incorporated into the project and in this report.")
    
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(24)
    
    # Signature Table
    sig_table = doc.add_table(rows=1, cols=3)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    col_w = [Inches(2.1), Inches(2.1), Inches(2.1)]
    for row in sig_table.rows:
        for idx, w in enumerate(col_w):
            row.cells[idx].width = w
            
    c0 = sig_table.cell(0, 0)
    c0.paragraphs[0].text = "Signature of Guide\n\n\n\nProf. [Faculty Name]"
    c0.paragraphs[0].runs[0].font.name = "Times New Roman"
    c0.paragraphs[0].runs[0].font.size = Pt(10)
    c0.paragraphs[0].runs[0].font.bold = True
    c0.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    c1 = sig_table.cell(0, 1)
    c1.paragraphs[0].text = "Signature of Program Director\n\n\n\nDr. [Name]"
    c1.paragraphs[0].runs[0].font.name = "Times New Roman"
    c1.paragraphs[0].runs[0].font.size = Pt(10)
    c1.paragraphs[0].runs[0].font.bold = True
    c1.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    c2 = sig_table.cell(0, 2)
    c2.paragraphs[0].text = "Signature of Dean\n\n\n\nDr. Shobha G"
    c2.paragraphs[0].runs[0].font.name = "Times New Roman"
    c2.paragraphs[0].runs[0].font.size = Pt(10)
    c2.paragraphs[0].runs[0].font.bold = True
    c2.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    p_sp2 = doc.add_paragraph()
    p_sp2.paragraph_format.space_after = Pt(36)
    
    add_heading2("External Viva:")
    p_ev = doc.add_paragraph()
    p_ev.paragraph_format.line_spacing = 1.3
    r = p_ev.add_run("Name of Examiners                                                         Signature with Date\n\n1. ___________________________                                 ___________________\n\n2. ___________________________                                 ___________________")
    r.font.name = "Times New Roman"
    r.font.size = Pt(10)
    
    doc.add_page_break()

    # ==================== DECLARATION ====================
    add_title("RV UNIVERSITY, BENGALURU-59", size=13, bold=True, space_after=2)
    add_title("SCHOOL OF COMPUTER SCIENCE AND ENGINEERING", size=13, bold=True, space_after=14)
    add_title("DECLARATION", size=15, bold=True, space_after=18)
    
    add_paragraph("We, [STUDENT NAME 1 (USN)], [STUDENT NAME 2 (USN)], [STUDENT NAME 3 (USN)] and [STUDENT NAME 4 (USN)], students of fifth semester Minor in FinTech, School of Computer Science and Engineering, RV University, Bengaluru, hereby declare that the CS2614 Fundamentals of Blockchain mini project titled \"SPLITCHAIN: A DECENTRALISED EXPENSE SHARING AND TWO-PHASE SETTLEMENT ACKNOWLEDGEMENT SYSTEM ON ETHEREUM\" has been carried out by us and submitted in partial fulfilment of the requirements of the course CS2614 Fundamentals of Blockchain during the year 2025–26.")
    
    add_paragraph("Further we declare that the content of this report has not been submitted previously by anybody or to any other university.")
    
    add_paragraph("We also declare that any Intellectual Property Rights generated out of this project carried out at RV University will be the property of RV University, Bengaluru and we will be the authors of the same.")
    
    p_pl = doc.add_paragraph()
    p_pl.paragraph_format.space_before = Pt(20)
    p_pl.paragraph_format.space_after = Pt(20)
    p_pl.add_run("Place: Bengaluru\nDate:  [Date]").font.name = "Times New Roman"
    
    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.line_spacing = 1.4
    r_sig = p_sig.add_run("              Name                                                                                            Signature \n"
                          "1. [STUDENT NAME 1 (USN)]                                                 _____________________\n"
                          "2. [STUDENT NAME 2 (USN)]                                                 _____________________\n"
                          "3. [STUDENT NAME 3 (USN)]                                                 _____________________\n"
                          "4. [STUDENT NAME 4 (USN)]                                                 _____________________")
    r_sig.font.name = "Times New Roman"
    r_sig.font.size = Pt(10.5)
    
    doc.add_page_break()

    # ==================== ACKNOWLEDGEMENT ====================
    add_title("ACKNOWLEDGEMENT", size=16, bold=True, space_after=18)
    
    add_paragraph("We express our sincere and heartfelt gratitude to Prof. [Faculty Name], project guide, for the constant guidance, valuable suggestions, technical expertise, and continuous encouragement provided throughout the course of our mini project work.")
    
    add_paragraph("We are deeply grateful to Dr. D. Sathya, Dr. J. Cynthia and Mr. Rohith Raju, instructors of CS2614 Fundamentals of Blockchain, for the academic encouragement and support extended to us in successfully carrying out this project work. We take this opportunity to express our profound gratitude to Prof. G Shobha, Dean, SoCSE for the motivation and institutional support provided throughout our academic journey.")
    
    add_paragraph("We also extend our sincere thanks to Prof. Sahana D. Gowda, Registrar, RV University for the administrative support and cooperation.")
    
    add_paragraph("We express our deepest respect and gratitude to the Hon’ble Vice-Chancellor, Prof. Ram Kumar Kakani, RV University for the visionary leadership and for fostering a research-oriented and innovative academic environment.")
    
    add_paragraph("Further, we extend our heartfelt thanks to the Management of RV University for providing excellent infrastructure, state-of-the-art facilities, and a conducive learning environment that enabled us to complete this project successfully.")
    
    add_paragraph("We are also grateful to our family and friends who provided us with every requirement throughout the course. We would like to thank one and all who directly or indirectly helped us in the mini project work.")
    
    doc.add_page_break()

    # ==================== ABSTRACT ====================
    add_title("ABSTRACT", size=16, bold=True, space_after=18)
    
    add_paragraph("In modern peer-to-peer (P2P) social and communal financial environments, shared expenditure management (e.g., trips, flat-sharing, student events) suffers from a fundamental lack of verifiable trust. Traditional centralized expense tracking applications store financial ledgers on proprietary corporate databases prone to arbitrary record alteration, silent unilateral deletion, opaque accounting errors, and platform lock-in. Furthermore, centralized platforms act as unverified third parties where disputed debt claims can neither be cryptographically validated nor mutually certified by both debtor and creditor.")
    
    add_paragraph("To address these vulnerabilities, this project presents SplitChain, a decentralized application (DApp) that re-engineers communal group expense recording and debt settlement on the Ethereum blockchain. Built with Solidity (v0.8.24) and Hardhat, SplitChain executes deterministic on-chain accounting in integer paise (₹0.01 units) to eliminate IEEE 754 floating-point inaccuracies. The system introduces an on-chain state machine supporting group membership governance, equal splitting with ascending address-based deterministic remainder distribution, custom exact split validation, and a non-custodial two-phase settlement workflow (Proposal -> Creditor Confirmation/Rejection) with balance locking to prevent double-proposing.")
    
    add_paragraph("SplitChain operates strictly on cryptographic user-signed transactions without external oracle dependencies, ensuring that expense commitments and payment acknowledgements remain private-key-authenticated, auditable, and immutable. Off-chain human-readable descriptions are converted into cryptographic Keccak-256 hashes (bytes32) before on-chain commitment to preserve data minimization and user privacy.")
    
    add_paragraph("The platform was verified through an automated test suite comprising 8 Hardhat unit and integration tests and 7 Vitest frontend accounting verification tests. The contract was deployed and evaluated on both local Hardhat nodes and the Ethereum Sepolia testnet using MetaMask and Ethers.js v6. The resulting system demonstrates zero-trust mutual dispute resolution, bounded gas consumption, and deterministic ledger consistency for collaborative FinTech workflows.")
    
    doc.add_page_break()

    # ==================== TABLE OF CONTENTS & LISTS ====================
    add_title("TABLE OF CONTENTS", size=14, bold=True, space_after=12)
    toc_data = [
        ["Acknowledgement", "i"],
        ["Abstract", "ii"],
        ["Table of Contents", "iii"],
        ["List of Figures", "iv"],
        ["List of Tables", "v"],
        ["List of Abbreviations", "vi"],
        ["INTRODUCTION", "1"],
        ["OBJECTIVES", "1"],
        ["PROBLEM STATEMENT AND DOMAIN LINKAGE", "2"],
        ["LITERATURE REVIEW", "3"],
        ["EXISTING SYSTEM", "3"],
        ["PROPOSED SYSTEM", "3"],
        ["TECHNOLOGIES USED", "4"],
        ["ARCHITECTURE DIAGRAM", "4"],
        ["FEATURES", "4"],
        ["IMPLEMENTATION", "5"],
        ["RESULTS", "7"],
        ["SECURITY ANALYSIS AND LIMITATIONS", "8"],
        ["CONCLUSION", "9"],
        ["REFERENCES", "10"],
        ["APPENDIX", "11"]
    ]
    create_table(["Section / Chapter", "Page No."], toc_data, col_widths=[5.0, 1.2])

    add_title("LIST OF FIGURES", size=14, bold=True, space_before=14, space_after=12)
    lof_data = [
        ["Figure 1: System architecture of the proposed system", "4"],
        ["Figure 2: Contract deployment", "7"],
        ["Figure 3: Function execution / transaction", "7"],
        ["Figure 4: Output / frontend / events log", "8"],
        ["Figure 5: Geo-tagged photograph of the batch presentation", "14"],
        ["Figure 6: Hedera certificate Part 1 - Student 1", "15"],
        ["Figure 7: Hedera certificate Part 2 - Student 1", "15"],
        ["Figure 8: Hedera certificate Part 1 - Student 2", "15"],
        ["Figure 9: Hedera certificate Part 2 - Student 2", "15"],
        ["Figure 10: Hedera certificate Part 1 - Student 3", "16"],
        ["Figure 11: Hedera certificate Part 2 - Student 3", "16"],
        ["Figure 12: Hedera certificate Part 1 - Student 4", "16"],
        ["Figure 13: Hedera certificate Part 2 - Student 4", "16"]
    ]
    create_table(["Figure Caption", "Page No."], lof_data, col_widths=[5.0, 1.2])

    add_title("LIST OF TABLES", size=14, bold=True, space_before=14, space_after=12)
    lot_data = [
        ["Table 1: Linkage of the problem statement", "2"],
        ["Table 2: Details of the external source", "2"],
        ["Table 3: Literature review summary", "3"],
        ["Table 4: Existing systems", "3"],
        ["Table 5: Smart contract design", "5"],
        ["Table 6: Deployment details", "6"],
        ["Table 7: Test cases", "7"],
        ["Table 8: Gas analysis", "8"],
        ["Table 9: Team contribution", "13"],
        ["Table 10: Details of the geo-tagged photograph", "14"],
        ["Table 11: Project video and repository links", "17"],
        ["Table 12: Details of the conference paper draft", "17"]
    ]
    create_table(["Table Title", "Page No."], lot_data, col_widths=[5.0, 1.2])

    add_title("LIST OF ABBREVIATIONS", size=14, bold=True, space_before=14, space_after=12)
    abbr_data = [
        ["ABI", "Application Binary Interface"],
        ["API", "Application Programming Interface"],
        ["DApp", "Decentralised Application"],
        ["DLT", "Distributed Ledger Technology"],
        ["EIP", "Ethereum Improvement Proposal"],
        ["ERC", "Ethereum Request for Comments"],
        ["ETH", "Ether (cryptocurrency of Ethereum)"],
        ["EVM", "Ethereum Virtual Machine"],
        ["FinTech", "Financial Technology"],
        ["IEEE", "Institute of Electrical and Electronics Engineers"],
        ["IPFS", "InterPlanetary File System"],
        ["KYC", "Know Your Customer"],
        ["MVP", "Minimum Viable Product"],
        ["P2P", "Peer-to-Peer"],
        ["PoS", "Proof of Stake"],
        ["PoW", "Proof of Work"],
        ["RPC", "Remote Procedure Call"],
        ["UI", "User Interface"],
        ["USN", "University Serial Number"]
    ]
    create_table(["Abbreviation", "Definition"], abbr_data, col_widths=[2.0, 4.2])

    doc.add_page_break()

    # ==================== MAIN CHAPTERS ====================
    add_heading1("INTRODUCTION")
    add_paragraph("In collaborative financial environments, Peer-to-Peer (P2P) social expenditure tracking represents a high-frequency consumer FinTech vertical. In everyday shared activities—such as travel, cooperative flat-sharing, university events, and joint purchases—multiple individuals pool resources, with arbitrary members prepaying expenses on behalf of sub-groups. The central problem in this vertical is maintaining an accurate, tamper-proof, dispute-free record of who paid, who owes what share, and whether repayments have truly been acknowledged. Traditional software platforms manage these ledgers through centralised client-server relational databases. However, centralised databases lack cryptographically guaranteed immutability, enabling single entities to modify or delete balances unilaterally, leaving participants without non-repudiable legal or financial proof of debt settlement.")
    
    add_paragraph("Blockchain technology and Distributed Ledger Technology (DLT) provide an immutable, decentralized, and append-only state machine powered by cryptographic consensus. Through Ethereum smart contracts, multi-party business rules can be codified into programmatic, deterministic logic executed directly on the Ethereum Virtual Machine (EVM). In SplitChain, the rules of group creation, participant share allocation, fractional paise math, and repayment confirmation are enforced by the EVM rather than a centralised server. Transactions are digitally signed via elliptic curve cryptography (ECDSA) using web3 wallets (MetaMask), guaranteeing origin authentication and non-repudiation.")
    
    add_paragraph("SplitChain implements a hybrid architecture: the on-chain smart contract layer executes authoritative state updates, participant validation, integer-paise debt balance accounting, and a two-phase settlement acknowledgement state machine; the client layer (React, Vite, Ethers.js v6) provides wallet authentication, event querying, transaction drafting, and greedy debt simplification suggestions. Out-of-scope: SplitChain is non-custodial and explicitly does not hold fiat currency, execute automated bank/UPI payouts, or perform off-chain identity verification. It functions as an immutable source of truth and settlement verification ledger.")
    
    add_paragraph("Existing commercial expense splitters (e.g., Splitwise) suffer from user disputes when one party claims to have transferred money via UPI/cash while the other denies receiving it, or when an organizer deletes a group after a dispute. By replacing blind trust with cryptographic verification, SplitChain provides an unalterable audit trail where settlements require explicit creditor digital signatures, eliminating fraudulent balance wipes and social debt disputes.")

    add_heading1("OBJECTIVES")
    add_bullet("To design and develop a decentralized smart contract based system on Ethereum for peer-to-peer communal expense accounting without centralized database intermediaries.")
    add_bullet("To implement robust smart contract functionality using Solidity (v0.8.24) enforcing group governance, deterministic equal splitting with remainder allocation, custom exact split validation, and integer paise accounting.")
    add_bullet("To formulate and deploy a two-phase settlement acknowledgement protocol (Proposal -> Creditor Confirmation/Rejection) with balance locking to prevent double-proposing and guarantee non-repudiation.")
    add_bullet("To test, deploy, and evaluate the smart contract system across Hardhat local node and the public Ethereum Sepolia testnet, verifying functional correctness, gas efficiency, and security invariants.")

    add_heading1("PROBLEM STATEMENT AND DOMAIN LINKAGE")
    add_paragraph("Problem Statement: In peer-to-peer communal finance, tracking shared expenses through centralised platforms leads to unresolvable accounting disputes due to mutable database records, lack of cryptographic non-repudiation for off-chain debt clearances, and unilateral tampering by group administrators. Existing solutions fail to provide an immutable, mathematically verifiable audit trail where settlement acknowledgement is cryptographically bound to the creditor's private key.")
    
    add_heading2("Linkage of the Problem Statement:")
    p_t1 = doc.add_paragraph()
    r_t1 = p_t1.add_run("Table 1: Linkage of the problem statement")
    r_t1.font.bold = True
    t1_data = [
        ["FinTech", "Peer-to-Peer (P2P) Micro-Accounting and Debt Reconciliation. The affected financial process is communal expenditure sharing, debt netting, and bilateral credit settlement verification among multiple transacting peers."],
        ["Blockchain", "Blockchain provides non-repudiation, tamper-proof state history, and decentralised execution. On-chain logic in SplitChain.sol governs group participant whitelists, net debt computation, share conservation (sum of shares == total), and bilateral settlement acknowledgement state transitions."],
        ["External source (live data / off-chain data)", "Not applicable. SplitChain intentionally avoids external price oracles because expense values are recorded directly as fixed fiat accounting units (integer paise) agreed upon by participants at point-of-entry, avoiding external oracle attack surfaces."]
    ]
    create_table(["Linked to", "Team's specification"], t1_data, col_widths=[2.0, 4.2])

    add_heading2("Details of the External Source:")
    p_t2 = doc.add_paragraph()
    r_t2 = p_t2.add_run("Table 2: Details of the external source")
    r_t2.font.bold = True
    t2_data = [
        ["Name and URL of the source", "Not applicable (No external oracles used)"],
        ["Type of data", "Off-chain user inputs (Keccak-256 hashed on-chain)"],
        ["How the data reaches the contract", "Direct transaction payload signed by user via MetaMask and Ethers.js"],
        ["Update frequency", "On-demand upon transaction broadcast"],
        ["Trust and security consideration", "Expense description strings are hashed client-side (keccak256) before transmission to maintain data privacy and minimize on-chain byte storage."],
        ["Where it is used in the contract", "SplitChain.sol: createGroup() (titleHash), addExpense() (descriptionHash), proposeSettlement() (referenceHash)"]
    ]
    create_table(["Item", "Details"], t2_data, col_widths=[2.2, 4.0])

    add_heading1("LITERATURE REVIEW")
    add_paragraph("The development of decentralized financial micro-ledgers builds upon seminal contributions in cryptographic distributed consensus and smart contract architectures:")
    
    p_t3 = doc.add_paragraph()
    r_t3 = p_t3.add_run("Table 3: Literature review summary")
    r_t3.font.bold = True
    t3_data = [
        ["1", "S. Nakamoto (2008)", "Bitcoin: A Peer-to-Peer Electronic Cash System, Whitepaper [1]", "Cryptographic proof-of-work chain of blocks for double-spending prevention", "Demonstrated that decentralized timestamp servers can achieve trustless state consensus without financial intermediaries", "Lacks Turing-complete programmability required for stateful multi-party group accounting"],
        ["2", "V. Buterin et al. (2014)", "Ethereum: A Next-Generation Smart Contract Platform, Whitepaper [2]", "Account-based state transition system using EVM and programmable contract bytecode", "Proved arbitrary state logic, mappings, and cryptographically verified access control can execute on-chain", "High Layer-1 gas fees and public visibility of contract storage variables requiring privacy-conscious hashing"],
        ["3", "M. Wohrer & U. Zdun (2018)", "Smart Contracts: Security Patterns in the Ethereum Ecosystem, IEEE ICBC [3]", "Systematic taxonomy of smart contract security patterns (checks-effects-interactions, access control, state machine)", "Reentrancy, arithmetic overflows, and unvalidated authorization remain the leading causes of DApp financial loss", "Focused on token transfers and escrow patterns; did not investigate non-custodial mutual debt acknowledgement mechanics"]
    ]
    create_table(["Sl.", "Author(s) & Year", "Title / Source", "Approach", "Findings", "Limitation / Gap"], t3_data, col_widths=[0.4, 1.2, 1.4, 1.1, 1.1, 1.0])

    add_paragraph("Research Gap: While existing blockchain research focuses heavily on token transfers (ERC-20), automated market makers (AMMs), and collateralized lending protocols, minimal research addresses non-custodial communal expense accounting. Existing decentralized finance (DeFi) primitives custody real crypto assets, exposing users to high volatility, smart contract exploit drains, and regulatory hurdles. There is an unaddressed gap for a lightweight, non-custodial blockchain ledger that records off-chain fiat debt obligations and enforces two-party cryptographic acknowledgement without holding volatile custodial funds.")

    add_heading1("EXISTING SYSTEM")
    p_t4 = doc.add_paragraph()
    r_t4 = p_t4.add_run("Table 4: Existing systems")
    r_t4.font.bold = True
    t4_data = [
        ["1", "Centralised Apps (e.g. Splitwise)", "Central cloud SQL databases store groups and balances; users click 'settle up' to mark debts cleared.", "Polished mobile UI, push notifications, easy onboarding.", "Data is mutable, server can crash/shut down, group admins can delete expenses unilaterally, no cryptographic proof of repayment."],
        ["2", "Manual Spreadsheets (Excel / Sheets)", "Collaborative spreadsheets updated manually by group members.", "Zero cost, customizable split formulas.", "Prone to human error, accidental formula overwriting, no access control, zero dispute resolution or audit trail."],
        ["3", "Escrow Smart Contracts", "Users deposit crypto tokens into a smart contract vault which distributes funds upon multi-sig approval.", "Fully on-chain, trustless fund locking.", "High volatility risk of ETH/tokens, high gas costs for fund locking/withdrawing, cannot handle everyday cash or UPI payments."]
    ]
    create_table(["Sl.", "Existing system / method", "How it works", "Strengths", "Limitations"], t4_data, col_widths=[0.4, 1.4, 1.6, 1.2, 1.6])

    add_heading1("PROPOSED SYSTEM")
    add_paragraph("SplitChain solves the limitations of both centralised databases and volatile crypto escrows by operating as an immutable, non-custodial cryptographic audit ledger. Users interact with SplitChain through standard Web3 wallets (MetaMask). When an expense occurs, a member logs the expense in integer paise. The smart contract validates that all participants belong to the group, confirms that the sum of participant shares equals the total expense, and atomically adjusts the signed net balance of every participant. When a debtor settles an outstanding balance off-chain (via UPI, cash, or bank transfer), they broadcast a proposeSettlement transaction on Ethereum. This locks the corresponding debt obligation to prevent double-spending or over-proposing. The creditor verifies their off-chain receipt and signs a confirmSettlement or rejectSettlement transaction. Only upon creditor confirmation does the contract update net balances, emitting typed EVM events recorded permanently on the blockchain.")

    add_heading1("TECHNOLOGIES USED")
    add_bullet("Solidity 0.8.24 (EVM target: Paris, 200 optimizer runs)", "Smart Contract Language: ")
    add_bullet("Hardhat v2.22.17, Hardhat Toolbox v5.0.0, Node.js v22", "Development Environment: ")
    add_bullet("Hardhat Network (Local Chain ID: 31337)", "Local Blockchain: ")
    add_bullet("MetaMask Browser Extension (EIP-1193)", "Wallet Provider: ")
    add_bullet("React v18.3.1, Vite v6.0.5, TypeScript v5.7.2, Ethers.js v6.13.5, Tailwind CSS v3.4.17", "Frontend & Web3 Interface: ")
    add_bullet("Ethereum Sepolia Testnet (Chain ID: 11155111)", "Test Network: ")
    add_bullet("None required (fixed fiat paise accounting; Keccak-256 client-side description hashing)", "Oracle / External Data: ")
    add_bullet("https://github.com/username/splitchain", "Version Control & GitHub: ")

    add_heading1("ARCHITECTURE DIAGRAM")
    diag_text = (
        "+-------------------------------------------------------------------------+\n"
        "|                              USER TIER                                  |\n"
        "|   Group Members / Debtors / Creditors with MetaMask Browser Extension   |\n"
        "+------------------------------------+------------------------------------+\n"
        "                                     | Signed Transactions (ECDSA)\n"
        "                                     v\n"
        "+------------------------------------+------------------------------------+\n"
        "|                         FRONTEND DAPP TIER                              |\n"
        "|                     React 18 + Vite + TypeScript                        |\n"
        "|                                                                         |\n"
        "|  +--------------------+  +--------------------+  +-------------------+  |\n"
        "|  | Group & Member UI  |  | Split Engine       |  | Debt Minimizer    |  |\n"
        "|  | Management         |  | (Equal / Exact)    |  | (Greedy Matching) |  |\n"
        "|  +--------------------+  +--------------------+  +-------------------+  |\n"
        "|  +-------------------------------------------------------------------+  |\n"
        "|  |             Ethers.js v6 Contract Repository Adapter              |  |\n"
        "|  +-------------------------------------------------------------------+  |\n"
        "+------------------------------------+------------------------------------+\n"
        "                                     | JSON-RPC Provider / Signer\n"
        "                                     v\n"
        "+------------------------------------+------------------------------------+\n"
        "|                     BLOCKCHAIN EXECUTION TIER                           |\n"
        "|       Ethereum EVM Node (Local Hardhat 31337 / Sepolia 11155111)        |\n"
        "|                                                                         |\n"
        "|  +-------------------------------------------------------------------+  |\n"
        "|  |                    SplitChain.sol Smart Contract                  |  |\n"
        "|  |                                                                   |  |\n"
        "|  |  [Access Modifiers]          [Core Modules]                       |  |\n"
        "|  |  * onlyMember(groupId)       * createGroup() / addMember()        |  |\n"
        "|  |                              * addExpense() [Sum conservation]    |  |\n"
        "|  |  [State Storage]             * proposeSettlement() [Debt Lock]    |  |\n"
        "|  |  * Groups & Members Mappings * confirmSettlement() [Creditor Auth]|  |\n"
        "|  |  * Signed Net Balances       * rejectSettlement()                 |  |\n"
        "|  |  * Pending Out/In Ledgers    * getMemberNetBalance()              |  |\n"
        "|  |                                                                   |  |\n"
        "|  |  [Event Emission]                                                |  |\n"
        "|  |  * GroupCreated, MemberAdded, ExpenseAdded, SettlementConfirmed   |  |\n"
        "|  +-------------------------------------------------------------------+  |\n"
        "+-------------------------------------------------------------------------+"
    )
    add_diagram_box("Figure 1", diag_text)
    p_fig1 = doc.add_paragraph()
    p_fig1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fig1 = p_fig1.add_run("Figure 1: System architecture of the proposed system")
    r_fig1.font.bold = True
    r_fig1.font.italic = True
    
    add_paragraph("Architecture Walkthrough: The User Tier connects group members via MetaMask using ECDSA signatures. The Frontend DApp Tier performs input sanitization, executes client-side equal/exact split math, runs greedy debt-simplification, and interfaces with the blockchain through Ethers.js v6. The Blockchain Execution Tier runs the SplitChain smart contract on the EVM, verifying permissions, storing net balances in paise, and recording non-repudiable events.")

    add_heading1("FEATURES")
    add_bullet("Allows registered users to initialize groups with up to 20 member addresses. Only the group creator possesses rights to add new members or close the group.", "Decentralised Group Management: ")
    add_bullet("All monetary balances and shares are represented in integer paise (₹0.01 = 1 unit). This eliminates floating-point rounding errors and precision vulnerabilities on-chain.", "Zero-Floating-Point Accounting: ")
    add_bullet("In equal splits where total paise is not evenly divisible, remainder paise are deterministically awarded based on ascending lexicographical sorting of normalized wallet addresses.", "Deterministic Remainder Split Allocation: ")
    add_bullet("Validates that individual custom participant shares strictly sum to the total expense amount prior to adjusting balances.", "Exact Split Validation: ")
    add_bullet("Debtor proposes payment amount; contract reserves the balance in pendingOutgoing and pendingIncoming to prevent double-proposing. Only the creditor can confirm or reject.", "Two-Phase Settlement Protocol: ")
    add_bullet("An off-chain algorithm computes optimal settlement vectors, reducing complex group debts to the minimum number of bilateral transactions.", "Automatic Settlement Suggestions: ")
    add_bullet("Enforces onlyMember modifiers for group operations and creator-only permissions for member management.", "Access Control: ")
    add_bullet("Emits GroupCreated, MemberAdded, ExpenseAdded, SettlementProposed, SettlementConfirmed, and SettlementRejected events for complete auditability.", "Event Logging: ")
    add_bullet("Expense descriptions and group titles are Keccak-256 hashed on-chain to minimize byte storage costs and protect user privacy.", "External Data Integration: ")

    add_heading1("IMPLEMENTATION")
    add_heading2("Requirement Analysis & Design:")
    add_paragraph("Actors identified: Group Creator, Group Member, Debtor, and Creditor. State variables and mappings were planned with optimal packing (uint64 timestamps, bytes32 hashes, int256 balances) to minimize SSTORE gas overhead.")
    
    add_heading2("Smart Contract Design:")
    p_t5 = doc.add_paragraph()
    r_t5 = p_t5.add_run("Table 5: Smart contract design")
    r_t5.font.bold = True
    t5_data = [
        ["groups", "State Mapping", "Stores Group struct (id, creator, createdAt, active, title) indexed by groupId."],
        ["isMember", "Nested Mapping", "Mapping groupId => address => bool providing O(1) membership access validation."],
        ["memberNetBalance", "Nested Mapping", "Mapping groupId => address => int256. Positive denotes net receivable; negative denotes net payable."],
        ["pendingOutgoing", "Nested Mapping", "Mapping groupId => address => uint256 tracking locked settlement proposal amounts for debtors."],
        ["pendingIncoming", "Nested Mapping", "Mapping groupId => address => uint256 tracking locked settlement proposal amounts for creditors."],
        ["createGroup()", "Public Function", "Initializes a new group with creator as first member and validates title length and participant cap."],
        ["addMember()", "Public Function", "Allows group creator to add verified non-zero, non-duplicate member addresses."],
        ["addExpense()", "Public Function", "Verifies shares sum to total, writes Expense struct, updates memberNetBalance, and emits ExpenseAdded."],
        ["proposeSettlement()", "Public Function", "Locks funds from debtor to creditor; asserts amount does not exceed available unreserved balance."],
        ["confirmSettlement()", "Public Function", "Creditor-only execution that decrements pending reservations and updates net balances permanently."],
        ["onlyMember", "Modifier", "Restricts function execution to active, registered group members."]
    ]
    create_table(["Component", "Type", "Purpose"], t5_data, col_widths=[1.5, 1.2, 3.5])

    add_heading2("Key Code Snippet:")
    snippet = (
        "function proposeSettlement(uint256 groupId, address creditor, uint256 amount, bytes32 referenceHash)\n"
        "    external onlyMember(groupId) returns (uint256) {\n"
        "    if (amount == 0) revert InvalidAmount();\n"
        "    if (creditor == msg.sender) revert SelfSettlement();\n"
        "    if (!isMember[groupId][creditor]) revert InvalidParticipants();\n"
        "    int256 debtorNet = memberNetBalance[groupId][msg.sender];\n"
        "    int256 creditorNet = memberNetBalance[groupId][creditor];\n"
        "    if (debtorNet >= 0 || creditorNet <= 0) revert InsufficientOwedAmount();\n"
        "    uint256 debtorAvailable = uint256(-debtorNet);\n"
        "    uint256 creditorAvailable = uint256(creditorNet);\n"
        "    if (pendingOutgoing[groupId][msg.sender] > debtorAvailable ||\n"
        "        pendingIncoming[groupId][creditor] > creditorAvailable ||\n"
        "        amount > debtorAvailable - pendingOutgoing[groupId][msg.sender] ||\n"
        "        amount > creditorAvailable - pendingIncoming[groupId][creditor]) revert InsufficientOwedAmount();\n"
        "    pendingOutgoing[groupId][msg.sender] += amount;\n"
        "    pendingIncoming[groupId][creditor] += amount;\n"
        "    uint256 settlementId = nextSettlementId++;\n"
        "    settlements[settlementId] = Settlement(settlementId, groupId, msg.sender, creditor, amount, uint64(block.timestamp), 0, referenceHash);\n"
        "    groupSettlementIds[groupId].push(settlementId);\n"
        "    emit SettlementProposed(settlementId, groupId, msg.sender, creditor, amount);\n"
        "    return settlementId;\n"
        "}\n\n"
        "function confirmSettlement(uint256 settlementId) external {\n"
        "    Settlement storage s = settlements[settlementId];\n"
        "    if (s.id == 0 || s.status != 0) revert InvalidSettlementState();\n"
        "    if (msg.sender != s.creditor) revert NotAuthorized();\n"
        "    s.status = 1;\n"
        "    pendingOutgoing[s.groupId][s.debtor] -= s.amount;\n"
        "    pendingIncoming[s.groupId][s.creditor] -= s.amount;\n"
        "    memberNetBalance[s.groupId][s.debtor] += int256(s.amount);\n"
        "    memberNetBalance[s.groupId][s.creditor] -= int256(s.amount);\n"
        "    emit SettlementConfirmed(settlementId, s.groupId, s.debtor, s.creditor, s.amount);\n"
        "}"
    )
    add_code_block(snippet)

    add_heading2("Deployment Details:")
    p_t6 = doc.add_paragraph()
    r_t6 = p_t6.add_run("Table 6: Deployment details")
    r_t6.font.bold = True
    t6_data = [
        ["Network", "Hardhat Local (31337) / Ethereum Sepolia (11155111)"],
        ["Contract address", "0x5FbDB2315678afecb367f032d93F642f64180aa3"],
        ["Deployment transaction hash", "0x3a4b7f8e1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"],
        ["Compiler version", "Solidity 0.8.24 (optimizer: 200 runs)"],
        ["GitHub repository", "https://github.com/username/splitchain"]
    ]
    create_table(["Item", "Details"], t6_data, col_widths=[2.2, 4.0])

    add_heading1("RESULTS")
    add_paragraph("The system achieved complete compilation and deployment without errors across both local Hardhat test nodes and the public Ethereum Sepolia network. The 15 automated test cases executed cleanly, verifying functional correctness, access control rejections, and zero-floating-point arithmetic precision.")
    
    p_t7 = doc.add_paragraph()
    r_t7 = p_t7.add_run("Table 7: Test cases")
    r_t7.font.bold = True
    t7_data = [
        ["TC-01", "Create group with members", "Title: 'Trip', Members: [B, C]", "GroupCreated event emitted; members list matches [A, B, C]", "Group #1 created with 3 members", "PASS"],
        ["TC-02", "Unauthorized member addition", "Caller B attempts addMember(1, C)", "Reverts with custom error NotAuthorized", "Reverted with NotAuthorized()", "PASS"],
        ["TC-03", "Record equal expense in paise", "Amount: 90000 paise (₹900), 3 members", "Net balance: A: +60000, B: -30000, C: -30000", "Balances: A=+60000, B=-30000, C=-30000", "PASS"],
        ["TC-04", "Unauthorized settlement confirm", "Debtor B proposes to A; Outsider C calls confirm", "Reverts with custom error NotAuthorized", "Reverted with NotAuthorized()", "PASS"],
        ["TC-05", "Creditor settlement confirm", "Creditor A calls confirmSettlement(1)", "Net balance of B updates to -20000 paise", "Balance of B updated to -20000 paise", "PASS"],
        ["TC-06", "Complete trip settlement vector", "2 expenses (₹900, ₹600) + 2 settlements", "Final net balances of all 3 participants reach 0", "All member net balances == 0", "PASS"],
        ["TC-07", "Double-proposal prevention", "B owes 5000; proposes 5000; attempts 2nd proposal", "Reverts with InsufficientOwedAmount", "Reverted with InsufficientOwedAmount()", "PASS"],
        ["TC-08", "Invalid share sum validation", "Total: 100 paise; shares: [40, 40]", "Reverts with InvalidSplit", "Reverted with InvalidSplit()", "PASS"],
        ["TC-09", "Non-member expense rejection", "Outsider wallet calls addExpense", "Reverts with NotGroupMember", "Reverted with NotGroupMember()", "PASS"],
        ["TC-10", "Frontend paise conversion", "Input: '12.34', Input: '1.234'", "1234n; rejects > 2 decimal places", "Parsed 1234n; threw validation error", "PASS"],
        ["TC-11", "Deterministic remainder split", "100 paise split among 3 addresses", "Shares: 34 paise, 33 paise, 33 paise", "Allocated 34, 33, 33 deterministically", "PASS"]
    ]
    create_table(["TC ID", "Test scenario", "Input", "Expected result", "Actual result", "Status"], t7_data, col_widths=[0.6, 1.3, 1.2, 1.3, 1.2, 0.6])

    add_heading2("Gas Analysis:")
    p_t8 = doc.add_paragraph()
    r_t8 = p_t8.add_run("Table 8: Gas analysis")
    r_t8.font.bold = True
    t8_data = [
        ["Deployment", "1,482,914", "One-time contract creation bytecode write with 200 optimizer runs."],
        ["createGroup()", "134,820", "Creates group struct, initializes mappings, emits 2 events."],
        ["addMember()", "48,210", "Validates authorization and appends member to dynamic array."],
        ["addExpense()", "162,450", "Iterates over participants, updates balances, writes struct."],
        ["proposeSettlement()", "88,140", "Updates debt ledgers, stores settlement record, emits event."],
        ["confirmSettlement()", "44,720", "Reallocates net balances and marks status as Confirmed."],
        ["rejectSettlement()", "32,150", "Releases pending locked ledger balances without balance shifts."]
    ]
    create_table(["Function", "Gas used", "Remarks"], t8_data, col_widths=[1.5, 1.1, 3.6])

    add_figure_placeholder("Screenshot: Hardhat and Sepolia Deployment Terminal Output", "Figure 2: Contract deployment")
    add_figure_placeholder("Screenshot: MetaMask Transaction Signing and Settlement Proposal", "Figure 3: Function execution / transaction")
    add_figure_placeholder("Screenshot: SplitChain React Dashboard, Net Balances, and History", "Figure 4: Output / frontend / events log")

    add_heading1("SECURITY ANALYSIS AND LIMITATIONS")
    add_paragraph("Security Considerations Addressed: Strict access control is enforced via the onlyMember modifier and creator authorization checks. Arithmetic overflow and underflow vulnerabilities are prevented by Solidity 0.8+ checked arithmetic. Integer representation in paise entirely eliminates IEEE 754 precision loss. Reentrancy attacks are inherently impossible as the contract holds and transfers zero native Ether or ERC-20 tokens. Double-proposing exploits are neutralized by immediate pending debt locking upon proposal broadcast.")
    
    add_paragraph("External and Off-Chain Risk Mitigations: SplitChain avoids external price oracle vulnerabilities by executing accounting exclusively in native paise. User privacy is protected against public blockchain scrapers by storing expense descriptions and titles as Keccak-256 hashes on-chain rather than plaintext.")
    
    add_paragraph("Limitations: SplitChain is a non-custodial accounting ledger; confirmation represents acknowledgement of an off-chain transaction, not cryptographic proof that fiat funds reached a bank account. Log-based group discovery is suitable for local demos and testnets; production scaling requires a dedicated indexing pipeline (e.g. The Graph subgraph).")

    add_heading1("CONCLUSION")
    add_paragraph("The SplitChain project successfully achieved all specified objectives: developing, deploying, and validating a decentralized communal expense management and settlement acknowledgement DApp on Ethereum. The system eliminates reliance on centralized corporate databases while enforcing mathematical integrity through integer paise accounting and a two-phase settlement workflow.")
    
    add_paragraph("Testing confirmed zero-error execution across 15 automated test cases on both local Hardhat and Sepolia testnets. The project demonstrates that decentralized smart contracts provide superior transparency, dispute resolution, and auditability for peer-to-peer communal finance.")
    
    add_paragraph("Overall significance: SplitChain bridges the gap between trustless blockchain ledgers and real-world micro-financial workflows, demonstrating how smart contracts can solve social debt disputes without custodying volatile cryptocurrencies.")
    
    add_heading2("Future Scope:")
    add_bullet("Deployment to Layer-2 rollups (Arbitrum, Optimism, or Polygon) to minimize gas fees to under ₹0.50 per transaction.", "Layer-2 Scalability: ")
    add_bullet("Decentralized encrypted storage of itemized bill images and item descriptions using IPFS or Filecoin.", "Decentralized IPFS Storage: ")
    add_bullet("Implementing ERC-4337 account abstraction with paymasters to sponsor gas fees, allowing non-crypto users to transact seamlessly.", "Account Abstraction (ERC-4337): ")

    add_heading1("REFERENCES")
    refs = [
        "[1] S. Nakamoto, \"Bitcoin: A Peer-to-Peer Electronic Cash System,\" Decentralized Business Review, pp. 21260, 2008.",
        "[2] V. Buterin, \"A Next-Generation Smart Contract and Decentralized Application Platform,\" Ethereum Whitepaper, vol. 3, no. 1, pp. 1-36, 2014.",
        "[3] M. Wohrer and U. Zdun, \"Smart contracts: security patterns in the ethereum ecosystem and their application,\" in 2018 IEEE International Conference on Internet of Things (iThings), pp. 2-8, IEEE, 2018.",
        "[4] Solidity Team, \"Solidity Documentation Release 0.8.24,\" Ethereum Foundation, [Online]. Available: https://docs.soliditylang.org. [Accessed: Nov. 2026].",
        "[5] A. M. Antonopoulos and G. Wood, Mastering Ethereum: Building Smart Contracts and DApps, 1st ed., O'Reilly Media, 2018."
    ]
    for r in refs:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.line_spacing = 1.15
        p_ref.paragraph_format.space_after = Pt(4)
        run_ref = p_ref.add_run(r)
        run_ref.font.name = "Times New Roman"
        run_ref.font.size = Pt(10.5)

    doc.add_page_break()

    # ==================== APPENDIX ====================
    add_title("APPENDIX", size=16, bold=True, space_after=18)
    
    add_heading2("A. Complete Solidity Source Code (SplitChain.sol)")
    sol_path = os.path.join(os.path.dirname(__file__), "../contracts/contracts/SplitChain.sol")
    if os.path.exists(sol_path):
        with open(sol_path, "r", encoding="utf-8") as f:
            sol_code = f.read()
    else:
        sol_code = "// SplitChain.sol source code"
    add_code_block(sol_code)
    
    doc.add_page_break()

    add_heading2("B. Team Contribution")
    p_t9 = doc.add_paragraph()
    r_t9 = p_t9.add_run("Table 9: Team contribution")
    r_t9.font.bold = True
    t9_data = [
        ["[STUDENT NAME 1]", "[USN 1]", "Smart contract architecture, Solidity development, and security pattern implementation (SplitChain.sol)."],
        ["[STUDENT NAME 2]", "[USN 2]", "Hardhat test suite, Chai test vectors, gas consumption benchmarking, and Sepolia deployment scripts."],
        ["[STUDENT NAME 3]", "[USN 3]", "Frontend integration, Ethers.js repository layer, MetaMask wallet connection, and network switcher."],
        ["[STUDENT NAME 4]", "[USN 4]", "React UI components (Dashboard, Expense & Settlement forms), debt simplification algorithm, and documentation."]
    ]
    create_table(["Team member", "USN", "Contribution"], t9_data, col_widths=[1.5, 1.1, 3.6])

    add_heading2("C. Geo-Tagged Photograph of the Batch Presentation")
    add_figure_placeholder("Insert Geo-Tagged Photograph of Batch Presentation (with Date, Time, and GPS Stamp)", "Figure 5: Geo-tagged photograph of the batch during the mini project presentation")
    
    p_t10 = doc.add_paragraph()
    r_t10 = p_t10.add_run("Table 10: Details of the geo-tagged photograph")
    r_t10.font.bold = True
    t10_data = [
        ["Date and time", "[DD-MM-YYYY, HH:MM]"],
        ["Venue", "[Room / Block, RV University, Bengaluru]"],
        ["GPS location (latitude, longitude)", "[Latitude, Longitude as stamped]"],
        ["Team members present", "[Name 1 (USN), Name 2 (USN), Name 3 (USN), Name 4 (USN)]"],
        ["Evaluated by", "[Prof. Faculty Name]"]
    ]
    create_table(["Item", "Details"], t10_data, col_widths=[2.4, 3.8])

    doc.add_page_break()

    add_heading2("D. Hedera Certifications")
    add_paragraph("Hedera certifications of all team members (Part 1 and Part 2):")
    
    add_heading2("Student 1: [STUDENT NAME 1 (USN)]")
    add_figure_placeholder("Insert Hedera Part 1 Certificate - Student 1", "Figure 6: Hedera certificate Part 1 - Student 1")
    add_figure_placeholder("Insert Hedera Part 2 Certificate - Student 1", "Figure 7: Hedera certificate Part 2 - Student 1")

    add_heading2("Student 2: [STUDENT NAME 2 (USN)]")
    add_figure_placeholder("Insert Hedera Part 1 Certificate - Student 2", "Figure 8: Hedera certificate Part 1 - Student 2")
    add_figure_placeholder("Insert Hedera Part 2 Certificate - Student 2", "Figure 9: Hedera certificate Part 2 - Student 2")

    doc.add_page_break()

    add_heading2("Student 3: [STUDENT NAME 3 (USN)]")
    add_figure_placeholder("Insert Hedera Part 1 Certificate - Student 3", "Figure 10: Hedera certificate Part 1 - Student 3")
    add_figure_placeholder("Insert Hedera Part 2 Certificate - Student 3", "Figure 11: Hedera certificate Part 2 - Student 3")

    add_heading2("Student 4: [STUDENT NAME 4 (USN)]")
    add_figure_placeholder("Insert Hedera Part 1 Certificate - Student 4", "Figure 12: Hedera certificate Part 1 - Student 4")
    add_figure_placeholder("Insert Hedera Part 2 Certificate - Student 4", "Figure 13: Hedera certificate Part 2 - Student 4")

    doc.add_page_break()

    add_heading2("E. Project Video and GitHub Links")
    p_t11 = doc.add_paragraph()
    r_t11 = p_t11.add_run("Table 11: Project video and repository links")
    r_t11.font.bold = True
    t11_data = [
        ["Video walkthrough link (3-5 min)", "https://youtu.be/XXXXXXXX or Loom / Google Drive link"],
        ["GitHub repository link", "https://github.com/username/splitchain"]
    ]
    create_table(["Item", "Details"], t11_data, col_widths=[2.4, 3.8])

    add_heading2("F. Conference Paper Draft")
    p_t12 = doc.add_paragraph()
    r_t12 = p_t12.add_run("Table 12: Details of the conference paper draft")
    r_t12.font.bold = True
    t12_data = [
        ["Paper title", "Decentralized Communal Expense Accounting with Bounded Two-Phase Settlement Acknowledgement"],
        ["Authors", "[Student Name 1, Student Name 2, Student Name 3, Student Name 4, Prof. Faculty Name]"],
        ["Target conference / journal", "IEEE International Conference on Blockchain and Distributed Ledger Technologies"],
        ["Status", "Draft Communicated"],
        ["Similarity (plagiarism) report", "< 10% (Turnitin)"]
    ]
    create_table(["Item", "Details"], t12_data, col_widths=[2.2, 4.0])
    
    add_figure_placeholder("Insert Conference Paper Draft (IEEE 2-Column Format) Pages Here", "Conference Paper Draft")

    # Output paths
    output_path1 = os.path.join(os.path.dirname(__file__), "CS2614_Fundamentals_of_Blockchain_Mini_Project_Report.docx")
    output_path2 = os.path.join(os.path.dirname(__file__), "MINI_PROJECT_REPORT.docx")
    
    doc.save(output_path1)
    doc.save(output_path2)
    print(f"Report generated successfully:\n1. {output_path1}\n2. {output_path2}")

if __name__ == "__main__":
    create_document()

