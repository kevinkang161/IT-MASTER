import { Lesson, Chapter, Topic } from "@/types/database";

export interface TextbookSummary {
  gradeId: number;
  gradeName: string;
  bookSeries: string;
  totalLessons: number;
  themes: {
    id: string;
    themeTitle: string;
    lessonsRange: string;
    description: string;
    content: string;
    codeSnippet?: { language: string; code: string; caption?: string };
    table?: { headers: string[]; rows: string[][] };
  }[];
}

export const TEXTBOOK_SUMMARIES: TextbookSummary[] = [
  {
    gradeId: 10,
    gradeName: "Tin học 10",
    bookSeries: "Kết nối tri thức với cuộc sống (34 Bài – 6 Chủ đề)",
    totalLessons: 34,
    themes: [
      {
        id: "theme-10-1",
        themeTitle: "Chủ đề 1: Máy tính và xã hội tri thức (Bài 1 – Bài 7)",
        lessonsRange: "Bài 1 – Bài 7",
        description: "Thông tin và dữ liệu, thiết bị thông minh, biểu diễn số nhị phân, bảng mã ASCII/Unicode, dữ liệu logic, âm thanh và hình ảnh số.",
        content: `### 1. Thông tin và xử lí thông tin (Bài 1)
- **Thông tin & Dữ liệu:** Thông tin là sự hiểu biết của con người về thế giới xung quanh; dữ liệu là thông tin đã được đưa vào máy tính dưới các dạng như số, văn bản, hình ảnh, âm thanh.
- **Quy trình xử lí thông tin 4 bước:** Tiếp nhận dữ liệu → Xử lí dữ liệu → Đưa ra kết quả → Lưu trữ dữ liệu.
- **Đơn vị đo lượng dữ liệu:** Bit (b) là đơn vị nhỏ nhất (0 hoặc 1).
  - 1 Byte (B) = 8 bit
  - 1 KB = 1024 B | 1 MB = 1024 KB | 1 GB = 1024 MB | 1 TB = 1024 GB.

### 2. Thiết bị thông minh & Cách mạng 4.0 (Bài 2)
- **Thiết bị thông minh:** Thiết bị điện tử hoạt động tự chủ, có khả năng tương tác với môi trường qua cảm biến và kết nối mạng (smartphone, smartwatch, smart TV, robot hút bụi,...).
- **Cách mạng 4.0:** Dựa trên trụ cột AI, IoT, Big Data và Điện toán đám mây (Cloud Computing).

### 3. Bảng mã văn bản (Bài 3)
- **ASCII:** Sử dụng 7 bit (128 kí tự) hoặc 8 bit mở rộng (256 kí tự), chỉ mã hoá bảng chữ cái tiếng Anh không dấu và các kí hiệu điều khiển.
- **Unicode & UTF-8:** Chuẩn quốc tế hỗ trợ mọi ngôn ngữ (bao gồm tiếng Việt). UTF-8 mã hoá linh hoạt từ 1 đến 4 byte cho mỗi kí tự.

### 4. Hệ nhị phân và dữ liệu số nguyên (Bài 4)
- Máy tính chỉ thao tác trực tiếp trên dãy bit 0 và 1 (hệ nhị phân - cơ số 2).
- Biểu diễn số âm bằng mã bù 2: Đảo toàn bộ các bit và cộng thêm 1.

### 5. Dữ liệu logic (Bài 5)
- Chỉ nhận 2 giá trị: **True** (Đúng / 1) và **False** (Sai / 0).
- Các phép toán logic:
  - **AND:** Đúng khi cả hai toán hạng cùng đúng.
  - **OR:** Đúng khi có ít nhất một toán hạng đúng.
  - **NOT:** Đảo ngược giá trị logic.
  - **XOR:** Đúng khi hai giá trị khác nhau.

### 6. Số hoá âm thanh và hình ảnh (Bài 6 & 7)
- **Âm thanh (PCM):** Lấy mẫu theo chu kì (tần số lấy mẫu Hz) và lượng tử hoá biên độ (độ sâu bit). Định dạng WAV (không nén), MP3 (nén mất dữ liệu).
- **Hình ảnh (Bitmap):** Tạo bởi lưới điểm ảnh (pixel). Hệ màu RGB 24 bit (mỗi kênh Red, Green, Blue chiếm 8 bit).
  - *Dung lượng ảnh chưa nén = Số điểm ảnh × Độ sâu màu (bit).*`,
        table: {
          headers: ["Phép toán / Quy đổi", "Quy tắc thực hiện", "Ví dụ minh họa"],
          rows: [
            ["Thập phân → Nhị phân", "Chia liên tiếp cho 2, lấy phần dư từ dưới lên", "13₁₀ = 1101₂"],
            ["Nhị phân → Thập phân", "Nhân từng bit với 2ⁱ tương ứng rồi cộng lại", "1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11₁₀"],
            ["Cộng nhị phân", "0+0=0; 0+1=1; 1+1=10 (viết 0 nhớ 1)", "101₂ + 011₂ = 1000₂ (5 + 3 = 8)"],
            ["Số nguyên âm (bù 2)", "Đảo bit của giá trị tuyệt đối rồi cộng thêm 1", "Với 8 bit: -5 → đảo 00000101 thành 11111010 + 1 = 11111011₂"]
          ]
        }
      },
      {
        id: "theme-10-2",
        themeTitle: "Chủ đề 2 & 3: Mạng Internet, An toàn mạng & Pháp luật số (Bài 8 – Bài 11)",
        lessonsRange: "Bài 8 – Bài 11",
        description: "Mạng LAN/WAN, Cloud computing, IoT, phần mềm độc hại, an toàn an ninh mạng và đạo đức bản quyền trong môi trường số.",
        content: `### 1. Mạng máy tính & Điện toán đám mây (Bài 8)
- **Phân loại mạng:**
  - LAN (Local Area Network): Mạng cục bộ trong phạm vi hẹp (phòng học, toà nhà).
  - WAN (Wide Area Network): Mạng diện rộng kết nối các mạng LAN qua khoảng cách địa lý lớn.
  - Internet: Mạng toàn cầu kết nối hàng triệu mạng máy tính trên thế giới.
- **Điện toán đám mây (Cloud Computing):** Cung cấp tài nguyên tính toán qua Internet gồm:
  - **IaaS** (Hạ tầng như một dịch vụ): Máy chủ ảo, lưu trữ.
  - **PaaS** (Nền tảng như một dịch vụ): Môi trường phát triển, triển khai ứng dụng.
  - **SaaS** (Phần mềm như một dịch vụ): Google Docs, Microsoft 365, Canva.
- **IoT (Internet of Things):** Kết nối các thiết bị thu thập và trao đổi dữ liệu tự động.

### 2. An toàn không gian mạng (Bài 9)
- **Phần mềm độc hại (Malware):**
  - **Virus:** Gắn vào tệp tin khác, lây lan khi tệp được mở.
  - **Worm (Sâu mạng):** Tự động nhân bản và lây lan qua lỗ hổng mạng mà không cần tác động của người dùng.
  - **Trojan:** Giả mạo phần mềm hữu ích để đánh lừa người dùng cài đặt.
  - **Ransomware:** Mã hoá tống tiền dữ liệu nạn nhân.
- **Tấn công lừa đảo (Phishing):** Giả mạo giao diện ngân hàng, mạng xã hội để đánh cắp tài khoản.
- **Biện pháp phòng ngừa:** Dùng mật khẩu mạnh, bật xác thực 2 yếu tố (2FA), sao lưu dữ liệu, không mở liên kết lạ.

### 3. Đạo đức, pháp luật & Bản quyền số (Bài 10 & 11)
- Tuân thủ Luật An ninh mạng, Luật Sở hữu trí tuệ.
- Phân biệt phần mềm thương mại độc quyền và phần mềm nguồn mở.
- Tôn trọng giấy phép bản quyền Creative Commons (CC).`
      },
      {
        id: "theme-10-3",
        themeTitle: "Chủ đề 4: Ứng dụng tin học – Thiết kế đồ hoạ Inkscape (Bài 12 – Bài 15)",
        lessonsRange: "Bài 12 – Bài 15",
        description: "Đồ hoạ vector vs bitmap, vẽ hình cơ bản, phép ghép đối tượng, đường Bezier và uốn chữ theo đường dẫn trong Inkscape.",
        content: `### 1. Phân biệt đồ hoạ Vector và Bitmap
- **Đồ hoạ Bitmap (Raster):** Lưu trữ theo ma trận các điểm ảnh (pixel). Phóng to bị vỡ hạt, răng cưa. Định dạng: PNG, JPG, BMP.
- **Đồ hoạ Vector:** Lưu trữ bằng các công thức toán học (điểm, đường cong, góc). Phóng to thu nhỏ tuỳ ý không bị vỡ nét, dung lượng nhẹ. Định dạng: SVG, AI.

### 2. Thao tác đối tượng cơ bản trong Inkscape (Bài 12 & 13)
- Công cụ vẽ: Hình chữ nhật (Rectangle), hình elip/tròn (Ellipse), hình đa giác và sao (Star/Polygon).
- Màu sắc: **Fill** (màu tô bên trong), **Stroke** (màu và độ dày đường viền), dải chuyển màu **Gradient**.
- Các phép ghép hình vector (Path operations):
  - **Union (Ctrl + +):** Hợp hai hình thành một.
  - **Difference (Ctrl + -):** Lấy hình dưới trừ phần giao với hình trên.
  - **Intersection (Ctrl + *):** Chỉ giữ lại phần giao thoa giữa hai hình.
  - **Exclusion (Ctrl + ^):** Lấy tất cả trừ phần giao thoa.

### 3. Đường cong Bezier & Văn bản nghệ thuật (Bài 14 & 15)
- Công cụ Pen (Draw Bezier curves): Vẽ đoạn thẳng và đường cong mượt mà.
- Hiệu chỉnh Node: Nút góc (Corner), nút trơn (Smooth), nút đối xứng (Symmetric).
- Đặt chữ chạy uốn lượn theo đường cong: Chọn cả chữ và đường cong → Menu **Text → Put on Path**.`
      },
      {
        id: "theme-10-4",
        themeTitle: "Chủ đề 5: Lập trình Python căn bản & Giải quyết vấn đề (Bài 16 – Bài 32)",
        lessonsRange: "Bài 16 – Bài 32",
        description: "Toàn bộ kiến thức cốt lõi về biến, kiểu dữ liệu, cấu trúc rẽ nhánh, vòng lặp, danh sách list, xâu ký tự, hàm và kỹ năng kiểm thử gỡ lỗi.",
        content: `### 1. Biến, Kiểu dữ liệu & Vào/Ra (Bài 16 – 18)
- Python tự động nhận diện kiểu khi gán: \`int\`, \`float\`, \`str\`, \`bool\`.
- Quy tắc đặt tên biến: Bắt đầu bằng chữ cái hoặc dấu gạch dưới \`_\`, không bắt đầu bằng số, không chứa ký tự đặc biệt, không trùng từ khóa (\`if\`, \`for\`, \`class\`,...).
- Toán tử số học: \`+\`, \`-\`, \`*\`, \`/\` (chia thực), \`//\` (chia lấy nguyên), \`%\` (chia lấy dư), \`**\` (lũy thừa).
- Nhập/Xuất:
  - \`input()\` luôn trả về kiểu \`str\` → cần ép kiểu: \`n = int(input())\` hoặc \`x = float(input())\`.
  - \`print(..., sep=' ', end='\\n')\`.

### 2. Cấu trúc rẽ nhánh & Vòng lặp (Bài 19 – 21)
- **Rẽ nhánh:** \`if điều_kiện:\`, \`elif điều_kiện:\`, \`else:\`.
- **Vòng lặp for:** Duyệt dãy số \`for i in range(start, stop, step):\` (chạy từ start đến stop - 1).
- **Vòng lặp while:** Lặp khi điều kiện còn đúng \`while điều_kiện:\`.
- Lệnh nhảy: \`break\` (thoát ngay khỏi vòng lặp), \`continue\` (bỏ qua lượt hiện tại sang lượt tiếp theo).

### 3. Kiểu dữ liệu Danh sách (List) & Xâu kí tự (Str) (Bài 22 – 25)
- **List (Có thể thay đổi - mutable):**
  - Khởi tạo: \`a = [1, 2, 3]\`, truy cập \`a[i]\` (chỉ số từ 0).
  - Phương thức: \`len(a)\`, \`a.append(x)\`, \`a.insert(i, x)\`, \`a.remove(x)\`, \`a.pop(i)\`, \`a.sort()\`.
- **Xâu ký tự (Bất biến - immutable):**
  - Không gán trực tiếp \`s[i] = 'x'\`.
  - Phương thức: \`len(s)\`, \`s.split()\`, \`' '.join(list)\`, \`s.find(sub)\`, \`s.replace(old, new)\`, \`s.upper()\`, \`s.lower()\`, \`s.strip()\`.

### 4. Hàm, Phạm vi biến & Gỡ lỗi (Bài 26 – 32)
- Định nghĩa hàm: \`def ten_ham(tham_so):\`, trả về kết quả bằng \`return\`.
- Biến cục bộ (local): chỉ có tác dụng trong hàm; Biến toàn cục (global): khai báo ngoài hàm (sửa trong hàm cần dùng \`global\`).
- 3 loại lỗi lập trình:
  1. **Lỗi cú pháp (SyntaxError):** Viết sai quy tắc, thụt lề sai.
  2. **Lỗi ngoại lệ khi chạy (Runtime):** \`ZeroDivisionError\`, \`IndexError\`, \`ValueError\`.
  3. **Lỗi ngữ nghĩa/logic:** Chương trình chạy không báo lỗi nhưng cho kết quả sai.`,
        codeSnippet: {
          language: "python",
          code: `# Thuật toán kiểm tra số nguyên tố tối ưu O(sqrt(N))
import math

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(math.isqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

num = int(input("Nhập số cần kiểm tra: "))
if is_prime(num):
    print(f"{num} là số nguyên tố")
else:
    print(f"{num} không phải là số nguyên tố")`,
          caption: "Hàm kiểm tra số nguyên tố chuẩn SGK Tin học 10"
        }
      },
      {
        id: "theme-10-5",
        themeTitle: "Chủ đề 6: Hướng nghiệp với Tin học (Bài 33 – Bài 34)",
        lessonsRange: "Bài 33 – Bài 34",
        description: "Tìm hiểu nhóm nghề thiết kế đồ họa máy tính và nghề phát triển phần mềm trong kỷ nguyên số.",
        content: `### 1. Nghề Thiết kế đồ hoạ máy tính (Bài 33)
- Lĩnh vực: Thiết kế nhận diện thương hiệu (Logo), giao diện người dùng (UI/UX), đồ hoạ truyền thông số, ấn phẩm in ấn.
- Yêu cầu năng lực: Tư duy thẩm mỹ, sáng tạo nghệ thuật, thành thạo các công cụ đồ họa vector/bitmap (Inkscape, Photoshop, Illustrator, Figma).

### 2. Nghề Phát triển phần mềm (Bài 34)
- Lĩnh vực: Lập trình viên Front-end/Back-end, kỹ sư di động, chuyên viên kiểm thử chất lượng (QA/QC), quản lý dự án công nghệ.
- Yêu cầu năng lực: Tư duy giải thuật, cấu trúc dữ liệu, khả năng tự học ngôn ngữ lập trình, kỹ năng làm việc nhóm và ngoại ngữ.`
      }
    ]
  },
  {
    gradeId: 11,
    gradeName: "Tin học 11",
    bookSeries: "Kết nối tri thức với cuộc sống (Phần chung + CS + ICT)",
    totalLessons: 31,
    themes: [
      {
        id: "theme-11-1",
        themeTitle: "Chủ đề 1: Hệ điều hành & Kiến trúc phần cứng (Bài 1 – Bài 5)",
        lessonsRange: "Bài 1 – Bài 5",
        description: "Vai trò hệ điều hành, phần mềm nguồn mở, kiến trúc Von Neumann, cổng logic và kết nối thiết bị số.",
        content: `### 1. Hệ điều hành – OS (Bài 1 & 2)
- Hệ điều hành đóng vai trò là cầu nối trung gian giữa phần cứng máy tính và người dùng/phần mềm ứng dụng.
- **Nhiệm vụ trọng tâm:** Quản lý tiến trình CPU, cấp phát bộ nhớ RAM, quản lý hệ thống tệp tin, điều khiển thiết bị ngoại vi và kiểm soát bảo mật.
- Các hệ điều hành thông dụng: Windows, macOS, Linux (Ubuntu), Android, iOS.

### 2. Phần mềm nguồn mở & Phần mềm Internet (Bài 3)
- **Phần mềm nguồn mở (PMNM):** Công khai mã nguồn theo giấy phép (ví dụ: GNU GPL), cho phép người dùng tự do sao chép, nghiên cứu, sửa đổi và phân phối (Linux, GIMP, LibreOffice, Python).
- **Phần mềm trên Internet:** Truy cập và sử dụng trực tiếp qua trình duyệt web mà không cần cài đặt (Google Docs, Canva, Office 365).

### 3. Kiến trúc bên trong máy tính (Bài 4)
- **Kiến trúc Von Neumann:**
  - **CPU (Bộ xử lý trung tâm):** Gồm Khối điều khiển (CU), Khối tính toán số học/logic (ALU) và các Thanh ghi (Registers).
  - **Bộ nhớ trong:** RAM (Bộ nhớ truy cập ngẫu nhiên, mất dữ liệu khi tắt nguồn) và ROM (Bộ nhớ chỉ đọc, lưu chương trình khởi động BIOS/UEFI).
  - **Bộ nhớ ngoài:** Ổ cứng SSD/HDD, thẻ nhớ, USB.
- **Cổng logic cơ bản:** AND, OR, NOT, XOR. Kết hợp các cổng tạo nên mạch cộng nhị phân nửa (Half Adder) và toàn phần (Full Adder).`
      },
      {
        id: "theme-11-2",
        themeTitle: "Chủ đề 2: Cơ sở dữ liệu quan hệ & Ngôn ngữ SQL (Bài 10 – Bài 16)",
        lessonsRange: "Bài 10 – Bài 16",
        description: "Mô hình quan hệ, khóa chính, khóa ngoại, hệ quản trị CSDL, câu lệnh SQL và quản trị an toàn dữ liệu.",
        content: `### 1. Khái niệm Cơ sở dữ liệu & DBMS (Bài 10 – 12)
- **Cơ sở dữ liệu (CSDL):** Tập hợp dữ liệu có cấu trúc, có liên quan logic với nhau, được lưu trữ lâu dài trên bộ nhớ ngoài để nhiều người cùng khai thác; khắc phục triệt để tình trạng dư thừa và thiếu nhất quán của tệp truyền thống.
- **Hệ quản trị CSDL (DBMS):** Phần mềm cung cấp môi trường tạo lập, lưu trữ, cập nhật và truy vấn CSDL (MySQL, PostgreSQL, SQL Server, SQLite, MS Access).
- *Hệ CSDL = CSDL + Hệ QTCSDL + Phần mềm ứng dụng.*

### 2. CSDL quan hệ, Khóa chính & Khóa ngoại (Bài 13)
- Dữ liệu được tổ chức dưới dạng các **Bảng (Table)**:
  - Hàng: Bản ghi (Record / Tuple) biểu diễn một đối tượng cụ thể.
  - Cột: Trường dữ liệu (Field / Attribute) biểu diễn một đặc trưng.
- **Khóa chính (Primary Key - PK):** Một hoặc tập hợp các trường định danh duy nhất mỗi bản ghi trong bảng. Bắt buộc: duy nhất và NOT NULL.
- **Khóa ngoài (Foreign Key - FK):** Trường ở bảng con tham chiếu tới khóa chính của bảng cha để thiết lập mối quan hệ và bảo toàn toàn vẹn tham chiếu.

### 3. Bảo mật CSDL & Nghề DBA (Bài 15 & 16)
- Phân quyền người dùng (chỉ đọc, ghi, toàn quyền).
- Sao lưu dự phòng định kỳ (Backup) và phục hồi khi xảy ra sự cố (Restore).
- **Quản trị viên CSDL (DBA):** Chịu trách nhiệm thiết kế, tối ưu hiệu năng truy vấn và bảo vệ an ninh dữ liệu tổ chức.`,
        codeSnippet: {
          language: "sql",
          code: `-- 1. Tạo bảng Danh mục Lớp học
CREATE TABLE Lop (
    MaLop VARCHAR(10) PRIMARY KEY,
    TenLop VARCHAR(50) NOT NULL
);

-- 2. Tạo bảng Học sinh có khóa ngoại liên kết tới bảng Lop
CREATE TABLE HocSinh (
    MaHS INT PRIMARY KEY,
    HoTen VARCHAR(50) NOT NULL,
    DiemTB FLOAT,
    MaLop VARCHAR(10),
    FOREIGN KEY (MaLop) REFERENCES Lop(MaLop)
);

-- 3. Truy vấn danh sách học sinh giỏi kèm tên lớp
SELECT hs.MaHS, hs.HoTen, hs.DiemTB, l.TenLop
FROM HocSinh hs
INNER JOIN Lop l ON hs.MaLop = l.MaLop
WHERE hs.DiemTB >= 8.0
ORDER BY hs.DiemTB DESC;`,
          caption: "Cú pháp SQL chuẩn tạo bảng và truy vấn kết nối bảng"
        }
      },
      {
        id: "theme-11-3",
        themeTitle: "Định hướng Khoa học máy tính (CS): Thuật toán & Độ phức tạp (Bài 17 – Bài 31)",
        lessonsRange: "Bài 17 – Bài 31 (CS)",
        description: "Mảng 1D/2D, thuật toán tìm kiếm nhị phân, sắp xếp chọn/chèn/nổi bọt, đánh giá độ phức tạp Big-O và phương pháp thiết kế chương trình.",
        content: `### 1. Mảng 1 chiều & Mảng 2 chiều (Bài 17 & 18)
- Mảng 1 chiều trong Python: Biểu diễn bằng \`list\`, truy cập \`a[i]\`.
- Mảng 2 chiều (Ma trận): Danh sách lồng nhau \`m = [[1, 2], [3, 4]]\`, truy cập \`m[i][j]\`.

### 2. Thuật toán Tìm kiếm & Sắp xếp (Bài 19 – 22)
- **Tìm kiếm tuần tự (Linear Search):** Duyệt từng phần tử từ đầu đến cuối. Áp dụng cho mọi mảng. Độ phức tạp $O(n)$.
- **Tìm kiếm nhị phân (Binary Search):** Chỉ áp dụng khi mảng **ĐÃ ĐƯỢC SẮP XẾP**. Mỗi bước chia đôi phạm vi tìm kiếm. Độ phức tạp $O(\\log n)$.
- **Sắp xếp chọn (Selection Sort):** Tìm phần tử nhỏ nhất ở phần chưa sắp xếp, đổi chỗ về đầu đoạn. $O(n^2)$.
- **Sắp xếp chèn (Insertion Sort):** Lấy từng phần tử chèn vào đúng vị trí trong đoạn đã sắp xếp phía trước. $O(n^2)$, trường hợp tốt nhất $O(n)$.
- **Sắp xếp nổi bọt (Bubble Sort):** So sánh các cặp phần tử liền kề và đổi chỗ nếu sai thứ tự. $O(n^2)$.

### 3. Đánh giá độ phức tạp thuật toán Big-O (Bài 24 & 25)
- Ký pháp Big-O thể hiện mức độ tăng thời gian chạy theo kích thước dữ liệu đầu vào $n$.
- Thứ tự tăng trưởng: $O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2) < O(2^n)$.`,
        table: {
          headers: ["Thuật toán", "Ý tưởng & Điều kiện tiên quyết", "Độ phức tạp thời gian"],
          rows: [
            ["Tìm kiếm tuần tự", "Duyệt lần lượt từng phần tử; mảng bất kỳ", "O(n)"],
            ["Tìm kiếm nhị phân", "Chia đôi khoảng tìm kiếm; mảng BẮT BUỘC ĐÃ SẮP XẾP", "O(log n)"],
            ["Sắp xếp chọn (Selection)", "Tìm giá trị nhỏ nhất đưa về đầu dãy", "O(n²)"],
            ["Sắp xếp chèn (Insertion)", "Chèn từng phần tử vào vị trí thích hợp của đoạn trước", "O(n²) (Tốt nhất O(n))"],
            ["Sắp xếp nổi bọt (Bubble)", "Đổi chỗ các cặp phần tử cạnh nhau nếu nghịch thế", "O(n²)"]
          ]
        },
        codeSnippet: {
          language: "python",
          code: `# Thuật toán Tìm kiếm nhị phân (Binary Search)
def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid  # Tìm thấy tại chỉ số mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1  # Không tìm thấy`,
          caption: "Mã nguồn Python Tìm kiếm nhị phân chuẩn SGK Tin học 11"
        }
      },
      {
        id: "theme-11-4",
        themeTitle: "Định hướng Tin học ứng dụng (ICT): Thực hành CSDL & Đa phương tiện (Bài 17 – Bài 31)",
        lessonsRange: "Bài 17 – Bài 31 (ICT)",
        description: "Quản trị MySQL/HeidiSQL, chỉnh sửa ảnh chuyên nghiệp với GIMP và biên tập video với VideoPad.",
        content: `### 1. Thực hành CSDL trên HeidiSQL (Bài 17 – 24)
- Kết nối tới MySQL Server qua cổng mặc định 3306 trên localhost.
- Thiết lập trường tự động tăng \`AUTO_INCREMENT\`, ràng buộc \`NOT NULL\`, tạo khóa ngoại qua giao diện đồ họa.
- Xuất (Export) tệp sao lưu \`.sql\` và Phục hồi (Import) dữ liệu khi chuyển máy chủ.

### 2. Chỉnh sửa ảnh với GIMP (Bài 25 – 28)
- Quản lý theo các **Lớp ảnh (Layer)** độc lập.
- Vùng chọn: Hình chữ nhật, Elip, Lasso (tự do), Fuzzy Select (chọn theo vùng màu tương đồng).
- Phục chế ảnh cũ: Dùng **Clone Stamp** và **Healing Tool** để tẩy vết xước, khuyết điểm.
- Tạo ảnh động GIF bằng cách xếp các khung hình trên từng layer.

### 3. Biên tập video với VideoPad (Bài 29 – 31)
- Dòng thời gian **Timeline**: Sắp xếp các đoạn clip, hình ảnh và đường tiếng âm thanh riêng biệt.
- Cắt và chia tách đoạn video (Split), thêm hiệu ứng chuyển cảnh (Transitions).
- Lồng nhạc nền, ghi âm thuyết minh và xuất video định dạng MP4 chất lượng cao.`
      }
    ]
  },
  {
    gradeId: 12,
    gradeName: "Tin học 12 & Ôn thi THPT",
    bookSeries: "Kết nối tri thức với cuộc sống (Phần chung + CS + ICT)",
    totalLessons: 30,
    themes: [
      {
        id: "theme-12-1",
        themeTitle: "Chủ đề 1: Trí tuệ nhân tạo (AI) – Bản chất & Tác động (Bài 1 – Bài 2)",
        lessonsRange: "Bài 1 – Bài 2",
        description: "Khái niệm AI, 5 đặc trưng trí tuệ nhân tạo, phân loại ANI/AGI, ứng dụng thực tiễn và các cảnh báo rủi ro đạo đức số.",
        content: `### 1. Khái niệm & 5 Đặc trưng cốt lõi của AI
**Trí tuệ nhân tạo (Artificial Intelligence - AI)** là ngành khoa học máy tính nghiên cứu cách tạo ra các hệ thống có khả năng tự động thực hiện các hành vi thông minh:
1. **Khả năng Học (Learning):** Tiếp thu tri thức từ dữ liệu để cải thiện hiệu suất theo thời gian.
2. **Khả năng Suy luận (Reasoning):** Rút ra kết luận logic từ các tiền đề có sẵn.
3. **Khả năng Nhận thức (Perception):** Cảm nhận thế giới qua hình ảnh (Computer Vision), âm thanh, cảm biến.
4. **Khả năng Hiểu ngôn ngữ tự nhiên (NLP):** Đọc hiểu, dịch thuật và đối thoại bằng tiếng người (như ChatGPT).
5. **Khả năng Giải quyết vấn đề (Problem Solving):** Lập kế hoạch, tìm đường đi và tối ưu hóa giải pháp.

### 2. Phân loại AI theo cấp độ
- **AI hẹp / AI yếu (ANI - Artificial Narrow Intelligence):** Được thiết kế chuyên biệt cho một nhiệm vụ cụ thể duy nhất (nhận diện khuôn mặt, cờ vua, trợ lý ảo Siri). *Tất cả AI hiện nay đều thuộc nhóm này.*
- **AI tổng quát / AI mạnh (AGI - Artificial General Intelligence):** Khả năng tư duy độc lập và giải quyết mọi tác vụ tương đương con người.

### 3. Ứng dụng & Cảnh báo rủi ro xã hội
- **Ứng dụng:** Chẩn đoán hình ảnh y tế, xe tự hành, phát hiện gian lận tài chính, cá nhân hoá lộ trình học tập.
- **Rủi ro:** Thay thế lao động gây thất nghiệp, video giả mạo lừa đảo (Deepfake), thiên lệch thuật toán (bias), xâm phạm quyền riêng tư và vấn đề kiểm soát an toàn.`
      },
      {
        id: "theme-12-2",
        themeTitle: "Chủ đề 2: Mạng máy tính, Thiết bị kết nối & Giao thức TCP/IP (Bài 3 – Bài 6)",
        lessonsRange: "Bài 3 – Bài 6",
        description: "Vai trò các thiết bị Switch, Router, AP, Modem; địa chỉ IPv4/IPv6; giao thức TCP/IP, DNS, HTTP/HTTPS.",
        content: `### 1. Thiết bị kết nối mạng thông dụng
- **Switch (Bộ chuyển mạch):** Kết nối các thiết bị trong cùng mạng LAN, chuyển gói tin chính xác đến cổng nhận dựa vào địa chỉ vật lý **MAC**.
- **Router (Bộ định tuyến):** Kết nối các mạng khác nhau (như LAN với Internet), tìm đường đi tối ưu cho gói tin dựa vào địa chỉ **IP**.
- **Access Point (AP):** Điểm truy cập phát sóng Wi-Fi không dây để mở rộng phạm vi mạng LAN.
- **Modem:** Thiết bị chuyển đổi (điều chế & giải điều chế) tín hiệu tương tự sang tín hiệu số từ nhà cung cấp dịch vụ Internet (ISP).

### 2. Bộ giao thức truyền thông TCP/IP
- **Địa chỉ IP:** Định danh duy nhất mỗi thiết bị trên mạng.
  - IPv4: 32 bit, viết dạng 4 số thập phân cách nhau bởi dấu chấm (ví dụ: \`192.168.1.1\`).
  - IPv6: 128 bit, khắc phục tình trạng cạn kiệt địa chỉ IPv4.
- **Giao thức TCP & IP:** IP đảm nhiệm định tuyến gói tin; TCP đảm bảo gói tin đến đích an toàn, đầy đủ và đúng thứ tự.
- **DNS (Domain Name System):** Hệ thống phân giải tên miền (dễ nhớ) sang địa chỉ IP (ví dụ: \`google.com\` → \`142.250.190.46\`).
- **HTTP / HTTPS:** Giao thức truyền tải siêu văn bản cho web; HTTPS được mã hoá bảo mật bằng chứng chỉ SSL/TLS.`,
        table: {
          headers: ["Thiết bị / Giao thức", "Tầng hoạt động / Phạm vi", "Chức năng cốt lõi"],
          rows: [
            ["Switch", "Mạng cục bộ (LAN)", "Chuyển tiếp khung dữ liệu dựa trên địa chỉ MAC của từng cổng"],
            ["Router", "Liên mạng (Internet/WAN)", "Định tuyến và chuyển tiếp gói tin dựa trên địa chỉ IP giữa các mạng"],
            ["Access Point", "Mạng không dây", "Cung cấp điểm kết nối Wi-Fi cho các thiết bị di động vào LAN"],
            ["Modem", "Giao tiếp với ISP", "Chuyển đổi tín hiệu đường truyền viễn thông thành tín hiệu số"],
            ["DNS", "Tầng ứng dụng", "Chuyển đổi tên miền trang web thành địa chỉ IP tương ứng"],
            ["HTTPS", "Tầng ứng dụng", "Truyền tải dữ liệu trang web được mã hóa bảo mật qua SSL/TLS"]
          ]
        }
      },
      {
        id: "theme-12-3",
        themeTitle: "Chủ đề 3: Thiết kế trang web với HTML5 và CSS3 (Bài 7 – Bài 18)",
        lessonsRange: "Bài 7 – Bài 18",
        description: "Cấu trúc HTML5 chuẩn, định dạng văn bản, danh sách, bảng, biểu mẫu Form, mô hình hộp Box Model và độ ưu tiên bộ chọn CSS.",
        content: `### 1. Cấu trúc chuẩn của tài liệu HTML5 (Bài 7)
- \`<!DOCTYPE html>\`: Khai báo phiên bản HTML5.
- \`<head>\`: Chứa siêu dữ liệu (\`<meta charset="utf-8">\`, thẻ tiêu đề \`<title>\`, liên kết file CSS).
- \`<body>\`: Chứa toàn bộ nội dung hiển thị trực tiếp cho người dùng.

### 2. Các thẻ phần tử thông dụng (Bài 8 – 12)
- Tiêu đề: \`<h1>\` đến \`<h6>\`. Đoạn văn: \`<p>\`. Định dạng: \`<strong>\` (in đậm), \`<em>\` (in nghiêng).
- Danh sách: \`<ul>\` (không thứ tự), \`<ol>\` (có thứ tự), \`<li>\` (mục).
- Bảng biểu: \`<table>\`, hàng \`<tr>\`, ô tiêu đề \`<th>\`, ô dữ liệu \`<td>\`, gộp ô \`colspan\`, \`rowspan\`.
- Liên kết & Đa phương tiện: \`<a href="..." target="_blank">\`, \`<img src="..." alt="...">\`, \`<audio controls>\`, \`<video controls>\`.
- Biểu mẫu: \`<form>\` với \`<input type="text|password|radio|checkbox|submit">\`, \`<select>\`, \`<textarea>\`.

### 3. CSS & Mô hình hộp (Box Model) (Bài 13 – 17)
- 3 cách chèn CSS: Inline (\`style="..."\`), Internal (thẻ \`<style>\` trong \`<head>\`), External (tệp \`.css\` riêng liên kết qua thẻ \`<link>\`).
- **Mô hình hộp (Box Model):**
  - **Content:** Vùng chứa nội dung chữ, ảnh.
  - **Padding:** Khoảng đệm từ nội dung tới đường viền.
  - **Border:** Đường viền bao quanh.
  - **Margin:** Khoảng cách lề bên ngoài đường viền tới các phần tử khác.
- **Độ ưu tiên bộ chọn (Specificity):**
  \`!important\` > Inline Style > \`#id\` > \`.class / :pseudo-class\` > Tên thẻ (\`tag\`).`,
        codeSnippet: {
          language: "html",
          code: `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Mô phỏng Thẻ Học Sinh IT MASTER</title>
    <style>
        /* CSS Box Model */
        .card {
            width: 320px;
            background-color: #ffffff;
            border: 2px solid #2563eb; /* Border */
            border-radius: 12px;
            padding: 16px;              /* Padding */
            margin: 20px auto;          /* Margin */
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
        }
        .card-header {
            color: #1e3a8a;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .badge {
            background-color: #dbeafe;
            color: #1d4ed8;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header">Học Sinh THPT Chuyên Tin</div>
        <p>Tham gia khoá học chuẩn Bộ Giáo dục 2026-2027.</p>
        <span class="badge">Lớp 12 - Chuẩn THPT</span>
    </div>
</body>
</html>`,
          caption: "Mẫu mã HTML5 và CSS minh họa Box Model"
        }
      },
      {
        id: "theme-12-4",
        themeTitle: "Định hướng Khoa học máy tính (CS): Mạng nâng cao, Học máy & Khoa học dữ liệu (Bài 22 – Bài 30)",
        lessonsRange: "Bài 22 – Bài 30 (CS)",
        description: "Firewall, đường truyền cáp quang, 3 nhánh Machine Learning, quy trình Khoa học dữ liệu 5V và phần mềm mô phỏng.",
        content: `### 1. Thiết bị mạng nâng cao & Đường truyền (Bài 22 – 24)
- **Thiết bị:**
  - **Repeater:** Khuếch đại và tái tạo tín hiệu suy hao trên đường truyền dài.
  - **Bridge (Cầu nối):** Ghép nối hai phân đoạn mạng cùng giao thức.
  - **Firewall (Tường lửa):** Kiểm soát luồng dữ liệu vào/ra dựa trên các chính sách bảo mật để ngăn chặn xâm nhập trái phép.
- **Đường truyền:** Cáp xoắn đôi (UTP/STP), Cáp quang (truyền bằng tín hiệu ánh sáng, băng thông siêu cao, không bị nhiễu điện từ), Sóng vô tuyến không dây (Wi-Fi, 4G/5G).

### 2. Các nhánh Học máy – Machine Learning (Bài 25)
1. **Học có giám sát (Supervised Learning):** Dữ liệu huấn luyện có gắn nhãn.
   - *Phân loại (Classification):* Đầu ra rời rạc (Ví dụ: Spam / Not Spam, Nhận diện số viết tay 0-9).
   - *Hồi quy (Regression):* Đầu ra liên tục (Ví dụ: Dự báo nhiệt độ, giá nhà).
2. **Học không giám sát (Unsupervised Learning):** Dữ liệu không gắn nhãn.
   - *Phân cụm (Clustering):* Nhóm khách hàng có hành vi tương đồng.
3. **Học tăng cường (Reinforcement Learning):** Tác tử học qua hành động và nhận điểm thưởng/phạt từ môi trường.

### 3. Khoa học dữ liệu & Dữ liệu lớn (Big Data 5V) (Bài 26 – 28)
- **Quy trình 5 bước:** Thu thập dữ liệu → Tiền xử lý/Làm sạch dữ liệu → Phân tích & Trực quan hoá → Xây dựng mô hình dự báo → Đánh giá và áp dụng thực tế.
- **Đặc trưng Big Data (5V):**
  1. *Volume (Khối lượng khổng lồ)*: Terabyte, Petabyte.
  2. *Velocity (Tốc độ sinh dữ liệu và xử lý thời gian thực)*.
  3. *Variety (Đa dạng định dạng)*: Số, chữ, ảnh, video, âm thanh.
  4. *Veracity (Độ tin cậy và chất lượng dữ liệu)*.
  5. *Value (Giá trị kinh tế/thực tiễn đem lại)*.

### 4. Mô phỏng trong giải quyết vấn đề (Bài 29 & 30)
- Sử dụng phần mềm mô phỏng (PhET, GeoGebra,...) để giả lập thí nghiệm khoa học trực quan, an toàn, tiết kiệm chi phí thử nghiệm.`
      },
      {
        id: "theme-12-5",
        themeTitle: "Định hướng Tin học ứng dụng (ICT): Kết nối thiết bị & Xây dựng Web với Google Sites (Bài 22 – Bài 28)",
        lessonsRange: "Bài 22 – Bài 28 (ICT)",
        description: "Kết nối màn hình mở rộng HDMI/USB-C, thiết kế và xuất bản trang web tin tức/dự án với Google Sites.",
        content: `### 1. Thực hành kết nối thiết bị số (Bài 22)
- **Kết nối màn hình phụ:** Qua cổng HDMI, DisplayPort hoặc Type-C với các chế độ:
  - *Duplicate:* Nhân bản màn hình chính.
  - *Extend:* Mở rộng không gian làm việc sang màn hình thứ hai.
  - *Second screen only:* Tắt màn hình chính, chỉ hiển thị trên màn hình phụ.
- **Ghép đôi Bluetooth:** Kết nối chuột, bàn phím, tai nghe không dây hoặc truyền file qua lại với điện thoại.

### 2. Thiết kế Website kéo thả với Google Sites (Bài 23 – 28)
- Chuẩn bị sơ đồ cấu trúc trang (Sitemap), thu thập văn bản, hình ảnh, video clip.
- Thiết kế Phần đầu trang (Header): Đặt tên trang, logo, ảnh nền bìa lớn.
- Bố cục nội dung (Body): Sử dụng các khối Layouts tạo sẵn; chèn văn bản, hình ảnh từ Google Drive; nhúng video YouTube và bản đồ Google Maps.
- Tương tác: Nhúng Google Forms để làm biểu mẫu liên hệ hoặc khảo sát ý kiến học sinh.
- Xuất bản (Publish): Cấp quyền công khai cho trang web và nhận đường link chia sẻ trực tuyến.`
      }
    ]
  }
];
