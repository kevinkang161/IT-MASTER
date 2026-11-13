import { Lesson } from "@/types/database";

export const CURRICULUM_LESSONS: Lesson[] = [
  // ==========================================
  // LỚP 10 (SGK Kết nối tri thức - 34 bài)
  // ==========================================
  {
    id: "les-10-01",
    topic_id: "topic-10-1-1",
    grade_id: 10,
    title: "Bài 1: Thông tin, Dữ liệu và Thiết bị thông minh",
    slug: "thong-tin-du-lieu-thiet-bi-thong-minh",
    difficulty: "co_ban",
    introduction: "Khám phá quy trình 4 bước xử lí thông tin, các đơn vị đo lượng dữ liệu số (Bit, Byte, KB, MB, GB, TB) và vai trò của thiết bị thông minh trong Cách mạng công nghiệp 4.0.",
    learning_objectives: [
      "Phân biệt rõ ràng khái niệm thông tin và dữ liệu",
      "Nắm vững 4 bước xử lí thông tin: Tiếp nhận → Xử lí → Xuất kết quả → Lưu trữ",
      "Quy đổi chuẩn xác các đơn vị đo lượng dữ liệu số (bội số 1024)",
      "Nhận diện đặc trưng của thiết bị thông minh và vai trò của IoT, AI",
    ],
    content_markdown: `## 1. Thông tin và dữ liệu trong kỷ nguyên số
- **Thông tin (Information):** Là sự hiểu biết, nhận thức của con người về thế giới xung quanh (sự vật, hiện tượng, con người).
- **Dữ liệu (Data):** Là thông tin đã được đưa vào máy tính dưới dạng các tín hiệu số (văn bản, số nguyên, số thực, âm thanh, hình ảnh).

### Quy trình 4 bước xử lí thông tin của máy tính:
1. **Tiếp nhận dữ liệu:** Thu nhận dữ liệu từ các thiết bị vào (Bàn phím, chuột, micro, camera, cảm biến).
2. **Xử lí dữ liệu:** CPU thực hiện tính toán, so sánh, biến đổi dữ liệu theo chương trình.
3. **Đưa ra kết quả:** Xuất thông tin qua thiết bị ra (Màn hình, máy in, loa).
4. **Lưu trữ dữ liệu:** Lưu kết quả trên bộ nhớ ngoài (SSD, HDD, USB, thẻ nhớ) để sử dụng lâu dài.

## 2. Đơn vị đo lượng dữ liệu
- **Bit (binary digit):** Đơn vị đo lượng dữ liệu nhỏ nhất trong tin học, chỉ nhận một trong hai giá trị \`0\` hoặc \`1\`.
- **Byte (B):** 1 Byte = 8 bit, dùng để lưu trữ 1 kí tự theo chuẩn ASCII.
- **Bảng bội số nhị phân:**
  - $1\\text{ KB (Kilobyte)} = 1024\\text{ B} = 2^{10}\\text{ B}$
  - $1\\text{ MB (Megabyte)} = 1024\\text{ KB} = 2^{20}\\text{ B}$
  - $1\\text{ GB (Gigabyte)} = 1024\\text{ MB} = 2^{30}\\text{ B}$
  - $1\\text{ TB (Terabyte)} = 1024\\text{ GB} = 2^{40}\\text{ B}$

## 3. Thiết bị thông minh & Cách mạng 4.0
- **Thiết bị thông minh (Smart Devices):** Là các thiết bị điện tử có bộ vi xử lý, có khả năng hoạt động tự chủ, kết nối mạng Internet và tương tác với môi trường thông qua các cảm biến (Sensors). Ví dụ: Smartphone, Smartwatch, Smart TV, Robot hút bụi tự hành.
- **Động lực 4.0:** Dựa trên 4 trụ cột công nghệ: Trí tuệ nhân tạo (AI), Internet vạn vật (IoT), Dữ liệu lớn (Big Data) và Điện toán đám mây (Cloud Computing).`,
    code_snippets: [],
    order_index: 1,
    is_published: true,
    is_draft: false,
    xp_reward: 50,
    estimated_minutes: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-10-02",
    topic_id: "topic-10-1-1",
    grade_id: 10,
    title: "Bài 2: Hệ nhị phân, Bảng mã ASCII/Unicode và Dữ liệu logic",
    slug: "he-nhi-phan-va-bieu-dien-du-lieu",
    difficulty: "trung_binh",
    introduction: "Tìm hiểu cách máy tính biểu diễn số trong hệ nhị phân, quy tắc chuyển đổi thập phân sang nhị phân, số bù 2, bảng mã Unicode UTF-8 và các phép toán logic cơ bản.",
    learning_objectives: [
      "Thực hiện thành thạo chuyển đổi qua lại giữa hệ thập phân (cơ số 10) và nhị phân (cơ số 2)",
      "Hiểu cách cộng nhị phân và biểu diễn số nguyên âm bằng mã bù 2",
      "Phân biệt bảng mã ASCII (7/8 bit) và chuẩn quốc tế Unicode / UTF-8",
      "Tính toán các biểu thức logic với toán tử AND, OR, NOT, XOR",
    ],
    content_markdown: `## 1. Hệ nhị phân và nguyên lý biểu diễn số
Máy tính sử dụng hệ nhị phân (gồm hai chữ số \`0\` và \`1\`) vì mạch điện tử chỉ có hai trạng thái vật lý ổn định (đóng/mở, có điện áp/không có điện áp).

### Quy tắc chuyển đổi:
1. **Thập phân sang Nhị phân:** Chia liên tiếp số thập phân cho 2, ghi lại các số dư, sau đó viết các số dư theo chiều ngược lại (từ dưới lên trên).
   - *Ví dụ:* $13_{10} = 1101_2$ (13 chia 2 dư 1, 6 chia 2 dư 0, 3 chia 2 dư 1, 1 chia 2 dư 1).
2. **Nhị phân sang Thập phân:** Nhân từng bit với $2^i$ tương ứng với trọng số vị trí rồi cộng lại.
   - *Ví dụ:* $1011_2 = 1\\times 2^3 + 0\\times 2^2 + 1\\times 2^1 + 1\\times 2^0 = 8 + 0 + 2 + 1 = 11_{10}$.
3. **Phép cộng nhị phân:**
   - $0 + 0 = 0$
   - $0 + 1 = 1$
   - $1 + 1 = 10$ (viết 0 nhớ 1 sang hàng bên trái)

## 2. Bảng mã văn bản ASCII và Unicode
- **ASCII (American Standard Code for Information Interchange):** Dùng 7 bit (mã hóa 128 ký tự) hoặc 8 bit (256 ký tự). Nhược điểm: Chỉ mã hóa được tiếng Anh và một số ký tự điều khiển.
- **Unicode:** Bộ mã chuẩn quốc tế mã hóa được toàn bộ các hệ chữ viết trên thế giới (bao gồm tiếng Việt có dấu).
  - **UTF-8:** Chuẩn mã hóa phổ biến nhất hiện nay trên Internet, sử dụng độ dài linh hoạt từ 1 đến 4 byte cho mỗi ký tự.

## 3. Dữ liệu logic (Boolean)
- Giá trị logic chỉ có hai trạng thái: **True** (Đúng / 1) và **False** (Sai / 0).
- **Bảng chân trị các phép toán logic:**
  - **AND (Phép hội):** Chỉ đúng khi cả hai cùng đúng ($1 \\land 1 = 1$).
  - **OR (Phép tuyển):** Đúng khi có ít nhất một toán hạng đúng ($0 \\lor 1 = 1$).
  - **NOT (Phủ định):** Đảo ngược giá trị ($\neg 1 = 0, \\neg 0 = 1$).
  - **XOR (Tuyển loại trừ):** Đúng khi hai toán hạng có giá trị khác nhau ($1 \\oplus 0 = 1, 1 \\oplus 1 = 0$).`,
    code_snippets: [],
    order_index: 2,
    is_published: true,
    is_draft: false,
    xp_reward: 60,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-10-03",
    topic_id: "topic-10-1-1",
    grade_id: 10,
    title: "Bài 3: Mạng Internet, Điện toán đám mây & An toàn không gian mạng",
    slug: "mang-internet-va-an-toan-so",
    difficulty: "co_ban",
    introduction: "Phân biệt mạng LAN, WAN và Internet; khám phá các mô hình điện toán đám mây (IaaS, PaaS, SaaS); nhận diện phần mềm độc hại (Virus, Worm, Ransomware, Phishing) và biện pháp bảo vệ bản thân trên môi trường số.",
    learning_objectives: [
      "So sánh phạm vi địa lý và ứng dụng của mạng LAN, WAN và mạng Internet",
      "Hiểu 3 mô hình dịch vụ đám mây: IaaS, PaaS, SaaS",
      "Phân biệt cơ chế lây nhiễm của Virus, Worm (sâu máy tính), Trojan và Ransomware",
      "Thực hiện các nguyên tắc bảo mật: Mật khẩu mạnh, xác thực 2 bước (2FA), tôn trọng bản quyền số",
    ],
    content_markdown: `## 1. Mạng máy tính và Điện toán đám mây
- **LAN (Local Area Network):** Mạng cục bộ trong phạm vi nhỏ (trường học, hộ gia đình, toà nhà).
- **WAN (Wide Area Network):** Mạng diện rộng kết nối nhiều mạng LAN qua phạm vi quốc gia, châu lục.
- **Internet:** Mạng toàn cầu kết nối hàng triệu mạng máy tính trên thế giới theo giao thức TCP/IP.
- **Điện toán đám mây (Cloud Computing):** Cung cấp tài nguyên phần mềm và phần cứng theo nhu cầu qua mạng:
  - **IaaS (Infrastructure as a Service):** Thuê máy chủ ảo, bộ nhớ lưu trữ, mạng (AWS EC2, Google Compute Engine).
  - **PaaS (Platform as a Service):** Thuê môi trường lập trình và cơ sở dữ liệu để triển khai ứng dụng.
  - **SaaS (Software as a Service):** Ứng dụng chạy trực tiếp trên web (Google Drive, Gmail, Canva, Microsoft 365).

## 2. Phần mềm độc hại (Malware) & Tấn công mạng
- **Virus máy tính:** Đoạn mã độc gắn liền vào một tệp tin hợp lệ khác và chỉ phát tán khi tệp đó được người dùng mở hoặc thực thi.
- **Worm (Sâu mạng):** Chương trình độc hại có khả năng **tự động nhân bản** và lây lan độc lập qua các lỗ hổng mạng mà không cần người dùng kích hoạt tệp.
- **Trojan (Ngựa thành Troy):** Giả danh phần mềm hữu ích, trò chơi miễn phí để đánh lừa người dùng tải về cài đặt, sau đó mở cửa sau (Backdoor) cho hacker.
- **Ransomware:** Mã độc tống tiền bằng cách mã hóa toàn bộ dữ liệu trên máy tính nạn nhân và đòi tiền chuộc để giải mã.
- **Tấn công lừa đảo (Phishing):** Giả mạo giao diện ngân hàng, mạng xã hội để lừa nạn nhân tự nhập mật khẩu, số thẻ tín dụng.

## 3. Đạo đức và Pháp luật trong môi trường số
- Tuân thủ nghiêm ngặt **Luật An ninh mạng** và **Luật Sở hữu trí tuệ**.
- Tôn trọng bản quyền phần mềm; phân biệt phần mềm thương mại độc quyền và phần mềm nguồn mở.
- Giấy phép chia sẻ tài nguyên giáo dục **Creative Commons (CC)**.`,
    code_snippets: [],
    order_index: 3,
    is_published: true,
    is_draft: false,
    xp_reward: 50,
    estimated_minutes: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-10-04",
    topic_id: "topic-10-1-1",
    grade_id: 10,
    title: "Bài 4: Đồ họa máy tính – Thiết kế Vector với Inkscape",
    slug: "thiet-ke-do-hoa-vector-inkscape",
    difficulty: "trung_binh",
    introduction: "Học cách phân biệt đồ họa Bitmap và Vector, làm chủ phần mềm Inkscape để vẽ logo, ghép hình, hiệu chỉnh đường cong Bezier và uốn chữ theo đường dẫn nghệ thuật.",
    learning_objectives: [
      "Phân biệt đặc điểm, ưu nhược điểm của ảnh Bitmap (PNG, JPG) và ảnh Vector (SVG)",
      "Sử dụng thành thạo các công cụ tạo hình: Hình chữ nhật, Elip, Đa giác, Sao",
      "Làm chủ 4 phép ghép hình vector: Union, Difference, Intersection, Exclusion",
      "Vẽ và biên tập các nút của đường cong Bezier với công cụ Pen",
    ],
    content_markdown: `## 1. Đồ họa Vector vs Đồ họa Bitmap
- **Đồ họa Bitmap (Raster):**
  - Lưu trữ dưới dạng lưới ma trận các điểm ảnh (**Pixel**).
  - Nhược điểm: Khi phóng to, hình ảnh sẽ bị vỡ nét, nhòe và răng cưa.
  - Định dạng thông dụng: PNG, JPG/JPEG, BMP, GIF.
- **Đồ họa Vector:**
  - Lưu trữ dưới dạng các phương trình toán học mô tả đường thẳng, đường cong, góc và màu sắc.
  - Ưu điểm vượt trội: Phóng to hoặc thu nhỏ tùy ý mà **không bao giờ bị giảm chất lượng**, dung lượng tệp tin nhẹ.
  - Định dạng chuẩn quốc tế: SVG (Scalable Vector Graphics), AI, EPS.

## 2. Kỹ thuật thiết kế đối tượng trong Inkscape
- **Màu sắc đối tượng:**
  - **Fill:** Màu tô phần bên trong của hình (màu đơn sắc, dải màu chuyển tiếp Gradient).
  - **Stroke:** Màu viền, độ dày và kiểu nét đứt của đường viền ngoài.
- **Các phép toán logic ghép hình (Path Operations):**
  - **Union (Hợp - Ctrl + +):** Gộp hai hay nhiều hình giao nhau thành một đối tượng duy nhất.
  - **Difference (Hiệu - Ctrl + -):** Lấy hình phía dưới trừ đi phần bị che lấp bởi hình phía trên.
  - **Intersection (Giao - Ctrl + *):** Chỉ giữ lại phần chung giữa hai hình.
  - **Exclusion (Loại trừ - Ctrl + ^):** Lấy tất cả ngoại trừ phần giao nhau.

## 3. Đường cong Bezier và Văn bản nghệ thuật
- **Công cụ Pen (Draw Bezier curves):** Nhấp chuột để tạo đoạn thẳng, nhấp và kéo chuột để tạo đường cong mượt mà.
- **Các loại nút điều khiển (Node):** Nút góc (Corner Node), nút trơn (Smooth Node), nút đối xứng (Symmetric Node).
- **Chữ nghệ thuật (Text on Path):** Chọn đồng thời đối tượng chữ và đường cong → Chọn Menu **Text → Put on Path** để chữ uốn lượn mềm mại theo đường dẫn.`,
    code_snippets: [],
    order_index: 4,
    is_published: true,
    is_draft: false,
    xp_reward: 55,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-10-05",
    topic_id: "topic-10-2-1",
    grade_id: 10,
    title: "Bài 5: Lập trình Python căn bản – Biến, Toán tử và Nhập/Xuất",
    slug: "lap-trinh-python-can-ban",
    difficulty: "co_ban",
    introduction: "Bước vào thế giới lập trình Python: Khai báo biến tự động nhận diện kiểu dữ liệu, các phép toán số học, lệnh ép kiểu int/float và cấu trúc rẽ nhánh if - elif - else.",
    learning_objectives: [
      "Khai báo biến hợp lệ và phân biệt kiểu int, float, str, bool",
      "Sử dụng chính xác các toán tử chia nguyên (//), chia dư (%), lũy thừa (**)",
      "Ép kiểu dữ liệu an toàn khi nhập dữ liệu bằng hàm input()",
      "Xây dựng câu lệnh rẽ nhánh if - elif - else giải quyết bài toán thực tế",
    ],
    content_markdown: `## 1. Biến và Kiểu dữ liệu trong Python
Python là ngôn ngữ thông dịch (interpreted language) có cú pháp sáng sủa. Python sử dụng quy tắc **thụt lề (Indentation)** bằng 4 dấu cách để xác định khối lệnh thay cho cặp dấu \`{}\`.

### Quy tắc đặt tên biến:
- Chỉ chứa chữ cái (a-z, A-Z), chữ số (0-9) và dấu gạch dưới (\`_\`).
- **Không được bắt đầu bằng chữ số** (ví dụ: \`1st_score\` là sai).
- **Phân biệt chữ hoa chữ thường** (\`diem\` khác \`Diem\`).
- **Không trùng từ khóa** của Python (\`if\`, \`else\`, \`for\`, \`while\`, \`def\`, \`class\`,...).

### Các toán tử số học đặc thù:
- \`/\`: Phép chia thực (luôn trả về số thực \`float\`, ví dụ \`7 / 2 = 3.5\`).
- \`//\`: Phép chia lấy phần nguyên (ví dụ \`7 // 2 = 3\`).
- \`%\`: Phép chia lấy phần dư (ví dụ \`7 % 2 = 1\`).
- \`**\`: Phép lũy thừa (ví dụ \`2 ** 3 = 8\`).

## 2. Nhập và Xuất dữ liệu
- Hàm \`input(prompt)\`: Luôn luôn trả về giá trị kiểu chuỗi ký tự (\`str\`). Khi cần nhập số, bắt buộc phải ép kiểu:
  - Nhập số nguyên: \`n = int(input("Nhập số: "))\`
  - Nhập số thực: \`x = float(input("Nhập điểm: "))\`
- Hàm \`print(*values, sep=' ', end='\\n')\`: Hỗ trợ tham số phân cách \`sep\` và ký tự kết thúc \`end\`.

## 3. Cấu trúc rẽ nhánh (Conditional Statements)
- Cú pháp dạng đầy đủ:
\`\`\`python
if điều_kiện_1:
    khối_lệnh_1
elif điều_kiện_2:
    khối_lệnh_2
else:
    khối_lệnh_mặc_định
\`\`\`
- Kết hợp điều kiện bằng toán tử logic: \`and\` (và), \`or\` (hoặc), \`not\` (phủ định).`,
    code_snippets: [
      {
        language: "python",
        code: `# Ví dụ: Xếp loại học lực học sinh THPT
diem_tb = float(input("Nhập điểm trung bình môn Tin học: "))

if diem_tb >= 8.0:
    xep_loai = "Giỏi"
elif diem_tb >= 6.5:
    xep_loai = "Khá"
elif diem_tb >= 5.0:
    xep_loai = "Trung bình"
else:
    xep_loai = "Chưa đạt"

print(f"Học lực: {xep_loai}")`,
        caption: "Chương trình phân loại học lực với if - elif - else"
      }
    ],
    order_index: 5,
    is_published: true,
    is_draft: false,
    xp_reward: 50,
    estimated_minutes: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-10-06",
    topic_id: "topic-10-2-2",
    grade_id: 10,
    title: "Bài 6: Cấu trúc lặp, Kiểu dữ liệu Danh sách (List) và Xâu ký tự (Str)",
    slug: "cau-truc-lap-danh-sach-xau-python",
    difficulty: "trung_binh",
    introduction: "Nắm vững kỹ thuật lập trình với vòng lặp for và while, cách sử dụng lệnh break/continue, các phương thức cốt lõi xử lý Danh sách (List) và Xâu ký tự (String).",
    learning_objectives: [
      "Sử dụng hàm range(start, stop, step) trong vòng lặp for",
      "Vận dụng vòng lặp while với điều kiện dừng chính xác, tránh lặp vô tận",
      "Thực hiện thành thạo thao tác thêm, xóa, sắp xếp trên Danh sách (List)",
      "Áp dụng các phương thức xử lý xâu ký tự: split(), join(), find(), replace()",
    ],
    content_markdown: `## 1. Cấu trúc lặp trong Python
### Vòng lặp \`for\` với hàm \`range()\`:
- \`range(n)\`: Sinh dãy số từ \`0\` đến \`n - 1\`.
- \`range(start, stop)\`: Sinh dãy số từ \`start\` đến \`stop - 1\`.
- \`range(start, stop, step)\`: Dãy số bước nhảy \`step\` (có thể là số âm để duyệt lùi).

### Vòng lặp \`while\`:
- Lặp lại khối lệnh chừng nào biểu thức điều kiện vẫn còn mang giá trị \`True\`.
- Cần có câu lệnh làm thay đổi điều kiện lặp để tránh rơi vào vòng lặp vô tận.

### Lệnh điều khiển luồng lặp:
- \`break\`: Lập tức thoát khỏi vòng lặp gần nhất chứa nó.
- \`continue\`: Bỏ qua các câu lệnh còn lại của lượt lặp hiện tại để chuyển sang lượt lặp tiếp theo.

## 2. Kiểu dữ liệu Danh sách (List)
- Là tập hợp các phần tử có thứ tự, có thể thay đổi giá trị (**mutable**), các phần tử có thể khác kiểu dữ liệu.
- Đánh chỉ số từ \`0\` (từ trái qua) hoặc từ \`-1\` (từ phải qua).
- **Các phương thức thường gặp:**
  - \`len(a)\`: Số lượng phần tử.
  - \`a.append(x)\`: Thêm phần tử \`x\` vào cuối danh sách.
  - \`a.insert(i, x)\`: Chèn phần tử \`x\` vào vị trí chỉ số \`i\`.
  - \`a.remove(x)\`: Xóa phần tử đầu tiên có giá trị bằng \`x\`.
  - \`a.pop(i)\`: Xóa và lấy ra phần tử tại chỉ số \`i\`.
  - \`a.sort()\`: Sắp xếp danh sách tăng dần.
  - \`x in a\`: Kiểm tra xem phần tử \`x\` có nằm trong danh sách hay không.

## 3. Kiểu dữ liệu Xâu ký tự (String)
- Là dãy ký tự bất biến (**immutable**), không thể thay đổi từng ký tự bằng phép gán \`s[i] = 'a'\`.
- **Các phương thức quan trọng:**
  - \`s.split(sep)\`: Tách xâu thành danh sách các từ.
  - \`sep.join(list_str)\`: Ghép danh sách xâu lại thành một chuỗi duy nhất.
  - \`s.find(sub)\`: Trả về vị trí xuất hiện đầu tiên của xâu con \`sub\` (hoặc \`-1\` nếu không thấy).
  - \`s.replace(old, new)\`: Thay thế tất cả xâu con \`old\` thành \`new\`.
  - \`s.strip()\`: Cắt bỏ khoảng trắng thừa ở hai đầu xâu.`,
    code_snippets: [
      {
        language: "python",
        code: `# Tách họ tên và tìm từ dài nhất trong một câu
cau = "Học sinh THPT ôn thi Tin học xuất sắc"
tu_danh_sach = cau.split()

print("Danh sách các từ:", tu_danh_sach)
print("Số lượng từ trong câu:", len(tu_danh_sach))

tu_dai_nhat = max(tu_danh_sach, key=len)
print(f"Từ dài nhất là: '{tu_dai_nhat}' với độ dài {len(tu_dai_nhat)} ký tự")`,
        caption: "Xử lý xâu và danh sách trong Python"
      }
    ],
    order_index: 6,
    is_published: true,
    is_draft: false,
    xp_reward: 65,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-10-07",
    topic_id: "topic-10-2-2",
    grade_id: 10,
    title: "Bài 7: Hàm, Phạm vi biến, Kiểm thử và Gỡ lỗi chương trình",
    slug: "ham-va-kiem-thu-chuong-trinh-python",
    difficulty: "trung_binh",
    introduction: "Học cách tổ chức chương trình khoa học theo mô-đun với hàm (def), hiểu rõ phạm vi biến cục bộ/toàn cục, phân biệt 3 loại lỗi và kỹ thuật gỡ lỗi (Debugging).",
    learning_objectives: [
      "Định nghĩa hàm với từ khóa def, truyền tham số và trả về giá trị qua return",
      "Phân biệt phạm vi hoạt động của biến cục bộ (Local) và biến toàn cục (Global)",
      "Nhận diện 3 loại lỗi: SyntaxError, Runtime Exception và Logic Error",
      "Thiết kế bộ dữ liệu kiểm thử (Test cases) bao gồm giá trị biên để kiểm chứng chương trình",
    ],
    content_markdown: `## 1. Khái niệm Hàm trong Python
Hàm là một khối lệnh được đặt tên, thực hiện một công việc cụ thể và có thể được tái sử dụng nhiều lần mà không cần viết lại mã nguồn.
- **Cú pháp định nghĩa:**
\`\`\`python
def ten_ham(tham_so_1, tham_so_2, ...):
    # Khối lệnh xử lý
    return gia_tri_tra_ve
\`\`\`
- **Tham số hình thức (Parameters):** Biến khai báo trong định nghĩa hàm.
- **Đối số thực sự (Arguments):** Giá trị truyền vào hàm khi gọi thực thi.

## 2. Phạm vi của biến (Scope)
- **Biến cục bộ (Local variable):** Khai báo bên trong hàm, chỉ có hiệu lực bên trong hàm đó và sẽ giải phóng khi hàm kết thúc.
- **Biến toàn cục (Global variable):** Khai báo ở ngoài các hàm, có thể đọc được ở mọi nơi trong tệp.
- *Lưu ý:* Khi muốn thay đổi giá trị của biến toàn cục bên trong một hàm, cần sử dụng từ khóa \`global ten_bien\`.

## 3. Phân loại lỗi lập trình & Kỹ năng gỡ lỗi
1. **Lỗi cú pháp (Syntax Error):**
   - Xảy ra khi viết sai quy tắc ngôn ngữ (thiếu dấu \`:\`, thụt lề sai, viết sai từ khóa).
   - Python sẽ dừng chương trình ngay khi dịch và chỉ ra vị trí lỗi.
2. **Lỗi ngoại lệ khi chạy (Runtime Exception):**
   - Cú pháp đúng nhưng phát sinh lỗi khi đang chạy dữ liệu thực tế.
   - Ví dụ: \`ZeroDivisionError\` (chia cho 0), \`IndexError\` (vượt quá chỉ số danh sách), \`ValueError\` (ép kiểu chữ thành số).
3. **Lỗi ngữ nghĩa / logic (Logic Error):**
   - Chương trình chạy bình thường không phát sinh lỗi, nhưng kết quả đầu ra bị sai lệch so với yêu cầu bài toán. Đây là loại lỗi khó phát hiện nhất.
- **Kỹ thuật gỡ lỗi:** Chèn lệnh \`print()\` theo dõi biến trung gian hoặc sử dụng công cụ Debugger đặt điểm ngắt (**Breakpoint**).`,
    code_snippets: [
      {
        language: "python",
        code: `# Ví dụ định nghĩa hàm giải phương trình bậc nhất ax + b = 0
def giai_pt_bac_1(a, b):
    if a == 0:
        if b == 0:
            return "Phương trình vô số nghiệm"
        else:
            return "Phương trình vô nghiệm"
    else:
        x = -b / a
        return f"Nghiệm x = {x:.2f}"

print(giai_pt_bac_1(2, -4))
print(giai_pt_bac_1(0, 5))`,
        caption: "Tổ chức chương trình dạng hàm và xử lý ngoại lệ biên"
      }
    ],
    order_index: 7,
    is_published: true,
    is_draft: false,
    xp_reward: 60,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ==========================================
  // LỚP 11 (SGK Kết nối tri thức - 31 bài)
  // ==========================================
  {
    id: "les-11-01",
    topic_id: "topic-11-1-1",
    grade_id: 11,
    title: "Bài 1: Hệ điều hành, Phần mềm nguồn mở và Phần cứng máy tính",
    slug: "he-dieu-hanh-va-kien-truc-may-tinh",
    difficulty: "co_ban",
    introduction: "Khám phá nguyên lý hoạt động của Hệ điều hành, ưu thế của phần mềm nguồn mở, kiến trúc máy tính Von Neumann và các cổng logic cơ bản.",
    learning_objectives: [
      "Nêu được vai trò trọng tâm của hệ điều hành đối với phần cứng và phần mềm ứng dụng",
      "Phân biệt phần mềm nguồn mở (Open Source) và phần mềm thương mại đóng",
      "Trình bày cấu trúc Von Neumann: CPU (CU, ALU, Registers), Bộ nhớ RAM/ROM và thiết bị I/O",
      "Hiểu nguyên lý hoạt động của các cổng logic AND, OR, NOT, XOR tạo nên mạch bán dẫn",
    ],
    content_markdown: `## 1. Hệ điều hành (Operating System - OS)
Hệ điều hành là phần mềm hệ thống quan trọng nhất, đóng vai trò môi trường trung gian kết nối giữa phần cứng máy tính và người dùng/ứng dụng.

### 5 Nhiệm vụ cốt lõi của Hệ điều hành:
1. **Quản lý tiến trình (CPU):** Phân chia thời gian CPU cho các chương trình chạy đa nhiệm.
2. **Quản lý bộ nhớ (RAM):** Cấp phát và thu hồi không gian nhớ khi ứng dụng hoạt động.
3. **Quản lý hệ thống tệp tin (File System):** Tổ chức cây thư mục, tệp tin trên ổ đĩa.
4. **Điều khiển thiết bị ngoại vi:** Giao tiếp với chuột, bàn phím, màn hình thông qua trình điều khiển (Driver).
5. **Đảm bảo bảo mật và giao diện người dùng:** Cung cấp giao diện đồ họa (GUI) và phân quyền bảo vệ dữ liệu.

## 2. Phần mềm nguồn mở (PMNM)
- **Khái niệm:** Phần mềm được công bố kèm mã nguồn mở theo các giấy phép quốc tế (như GNU GPL, MIT, Apache).
- **Quyền tự do của người dùng:** Tự do chạy chương trình, tự do nghiên cứu/sửa đổi mã nguồn, và tự do phân phối lại các bản sao cải tiến.
- **Ví dụ tiêu biểu:** Hệ điều hành Linux (Ubuntu), phần mềm văn phòng LibreOffice, ngôn ngữ Python, trình xử lý ảnh GIMP.

## 3. Kiến trúc Von Neumann bên trong máy tính
- **CPU (Bộ xử lý trung tâm):**
  - **CU (Control Unit):** Khối điều khiển chỉ đạo các thành phần khác làm việc theo nhịp xung đồng hồ.
  - **ALU (Arithmetic Logic Unit):** Khối số học và logic thực hiện các phép tính cộng, trừ, so sánh.
  - **Registers (Thanh ghi):** Bộ nhớ cực nhỏ, tốc độ cao nhất nằm ngay trong CPU để lưu trữ tạm các toán hạng.
- **Bộ nhớ trong:**
  - **RAM (Random Access Memory):** Bộ nhớ lưu dữ liệu tạm thời khi máy tính đang hoạt động; **mất dữ liệu khi mất điện**.
  - **ROM (Read Only Memory):** Bộ nhớ chỉ đọc, chứa chương trình khởi động phần cứng BIOS/UEFI; không mất dữ liệu.
- **Cổng logic cơ bản:** Các cổng bán dẫn AND, OR, NOT, XOR được kết hợp lại tạo thành các mạch tính toán số học (Half Adder, Full Adder) cấu thành nên CPU.`,
    code_snippets: [],
    order_index: 1,
    is_published: true,
    is_draft: false,
    xp_reward: 55,
    estimated_minutes: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-11-02",
    topic_id: "topic-11-2-1",
    grade_id: 11,
    title: "Bài 2: Hệ cơ sở dữ liệu quan hệ, Khóa chính và Khóa ngoại",
    slug: "co-so-du-lieu-quan-he-khoa-chinh",
    difficulty: "trung_binh",
    introduction: "Khái niệm Cơ sở dữ liệu quan hệ (RDBMS), nguyên tắc thiết kế bảng (Table), tính duy nhất của Khóa chính (Primary Key) và toàn vẹn tham chiếu của Khóa ngoại (Foreign Key).",
    learning_objectives: [
      "Hiểu lý do ra đời của CSDL để khắc phục nhược điểm dư thừa và bất nhất của tệp truyền thống",
      "Định nghĩa Bảng (Table), Bản ghi (Record / Row) và Trường dữ liệu (Field / Column)",
      "Thiết lập Khóa chính (Primary Key) đảm bảo tính duy nhất và NOT NULL",
      "Sử dụng Khóa ngoại (Foreign Key) tạo liên kết quan hệ 1 - 1 và 1 - Nhiều giữa các bảng",
    ],
    content_markdown: `## 1. Khái niệm Cơ sở dữ liệu & Hệ QTCSDL
- **Cơ sở dữ liệu (Database - CSDL):** Là một tập hợp các dữ liệu có cấu trúc, có liên quan logic với nhau, được lưu trữ lâu dài trên các thiết bị nhớ để phục vụ cho nhu cầu khai thác của nhiều người dùng và ứng dụng đồng thời.
- **Hệ quản trị CSDL (Database Management System - DBMS):** Là phần mềm chuyên dụng cung cấp môi trường để tạo lập, lưu trữ, cập nhật và truy xuất dữ liệu an toàn (MySQL, PostgreSQL, Microsoft SQL Server, Oracle, SQLite).
- *Mối liên hệ: Hệ CSDL = CSDL + Hệ QTCSDL + Các phần mềm ứng dụng.*

## 2. Mô hình dữ liệu quan hệ (Relational Model)
Được đề xuất bởi E.F. Codd năm 1970, dữ liệu được tổ chức hoàn toàn dưới dạng các **Bảng hai chiều (Table / Relation)**:
- **Bản ghi (Record / Tuple / Hàng):** Biểu diễn một đối tượng thực tế cụ thể (ví dụ: thông tin của 1 học sinh).
- **Trường (Field / Attribute / Cột):** Biểu diễn một thuộc tính của đối tượng (ví dụ: Mã học sinh, Họ tên, Điểm).

## 3. Khóa chính và Khóa ngoại
### Khóa chính (Primary Key - PK):
- Là một hoặc một tập hợp các trường dùng để **xác định duy nhất** mỗi bản ghi trong bảng.
- **2 tính chất bắt buộc:**
  1. *Tính duy nhất (Unique):* Không có hai bản ghi nào trùng giá trị khóa chính.
  2. *Không rỗng (NOT NULL):* Khóa chính không bao giờ được nhận giá trị rỗng.

### Khóa ngoại (Foreign Key - FK):
- Là trường ở bảng con tham chiếu trực tiếp đến Khóa chính của bảng cha.
- **Mục đích:** Thiết lập mối quan hệ liên kết giữa hai bảng và đảm bảo tính **toàn vẹn tham chiếu** (không thể nhập mã lớp không tồn tại ở bảng danh mục Lớp).`,
    code_snippets: [
      {
        language: "sql",
        code: `-- Tạo bảng Cha: PHONG_BAN
CREATE TABLE PhongBan (
    MaPB VARCHAR(10) PRIMARY KEY,
    TenPB VARCHAR(50) NOT NULL
);

-- Tạo bảng Con: NHAN_VIEN có khóa ngoại tham chiếu đến PhongBan
CREATE TABLE NhanVien (
    MaNV INT PRIMARY KEY,
    HoTen VARCHAR(50) NOT NULL,
    Luong FLOAT CHECK (Luong > 0),
    MaPB VARCHAR(10),
    FOREIGN KEY (MaPB) REFERENCES PhongBan(MaPB)
);`,
        caption: "Ví dụ định nghĩa Khóa chính và Khóa ngoại trong SQL"
      }
    ],
    order_index: 2,
    is_published: true,
    is_draft: false,
    xp_reward: 60,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-11-03",
    topic_id: "topic-11-2-2",
    grade_id: 11,
    title: "Bài 3: Ngôn ngữ truy vấn có cấu trúc SQL và Quản trị CSDL",
    slug: "ngon-ngu-truy-van-sql-nang-cao",
    difficulty: "trung_binh",
    introduction: "Làm chủ các câu lệnh SQL nền tảng: Tạo bảng (CREATE), thêm dữ liệu (INSERT), truy vấn có điều kiện (SELECT WHERE), sắp xếp (ORDER BY), kết nối nhiều bảng (INNER JOIN).",
    learning_objectives: [
      "Viết thành thạo câu lệnh CREATE TABLE với các kiểu dữ liệu INT, VARCHAR, FLOAT, DATE",
      "Thực hiện truy vấn lọc dữ liệu phức tạp với mệnh đề WHERE, toán tử LIKE, IN, BETWEEN",
      "Sắp xếp kết quả tăng dần (ASC) hoặc giảm dần (DESC) bằng ORDER BY",
      "Nối dữ liệu giữa các bảng liên quan bằng phép toán INNER JOIN",
    ],
    content_markdown: `## 1. Ngôn ngữ SQL (Structured Query Language)
SQL là ngôn ngữ tiêu chuẩn quốc tế dùng để tương tác và thao tác dữ liệu trong các hệ quản trị CSDL quan hệ.

### Các nhóm lệnh chính:
- **DDL (Định nghĩa dữ liệu):** \`CREATE TABLE\`, \`ALTER TABLE\`, \`DROP TABLE\`.
- **DML (Thao tác dữ liệu):** \`INSERT INTO\`, \`UPDATE\`, \`DELETE\`.
- **DQL (Truy vấn dữ liệu):** Cú pháp kinh điển \`SELECT ... FROM ... WHERE ...\`.

## 2. Cú pháp các câu lệnh SQL thông dụng
### Thêm mới bản ghi:
\`\`\`sql
INSERT INTO HocSinh (MaHS, HoTen, DiemTB) 
VALUES (101, 'Nguyễn Văn An', 8.5);
\`\`\`

### Cập nhật và Xóa bản ghi:
\`\`\`sql
UPDATE HocSinh SET DiemTB = 9.0 WHERE MaHS = 101;
DELETE FROM HocSinh WHERE MaHS = 101;
\`\`\`

### Truy vấn dữ liệu có điều kiện và sắp xếp:
\`\`\`sql
SELECT HoTen, DiemTB 
FROM HocSinh 
WHERE DiemTB >= 8.0 AND HoTen LIKE 'Nguyễn%'
ORDER BY DiemTB DESC;
\`\`\`

## 3. Nối bảng (INNER JOIN)
Khi dữ liệu phân bổ ở nhiều bảng có quan hệ khóa chính - khóa ngoại, ta sử dụng mệnh đề \`INNER JOIN ... ON ...\` để lấy thông tin kết hợp:
\`\`\`sql
SELECT hs.HoTen, hs.DiemTB, l.TenLop
FROM HocSinh hs
INNER JOIN Lop l ON hs.MaLop = l.MaLop
WHERE l.TenLop = '11A1';
\`\`\``,
    code_snippets: [
      {
        language: "sql",
        code: `-- Truy vấn học sinh đạt loại Giỏi kèm tên lớp học
SELECT hs.MaHS, hs.HoTen, hs.DiemTB, l.TenLop
FROM HocSinh hs
INNER JOIN Lop l ON hs.MaLop = l.MaLop
WHERE hs.DiemTB >= 8.0
ORDER BY hs.DiemTB DESC;`,
        caption: "Mẫu câu lệnh INNER JOIN chuẩn ma trận thi THPT"
      }
    ],
    order_index: 3,
    is_published: true,
    is_draft: false,
    xp_reward: 65,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-11-04",
    topic_id: "topic-11-2-2",
    grade_id: 11,
    title: "Bài 4: (CS) Thuật toán Tìm kiếm, Sắp xếp và Đánh giá độ phức tạp Big-O",
    slug: "thuat-toan-tim-kiem-sap-xep-do-phuc-tap",
    difficulty: "nang_cao",
    introduction: "Khám phá chuyên sâu định hướng Khoa học máy tính: Tìm kiếm tuần tự vs Tìm kiếm nhị phân, các thuật toán sắp xếp kinh điển (Selection, Insertion, Bubble) và đánh giá độ phức tạp thuật toán qua ký pháp Big-O.",
    learning_objectives: [
      "Cài đặt thuật toán Tìm kiếm nhị phân (Binary Search) đạt độ phức tạp O(log n)",
      "So sánh cơ chế hoạt động của Sắp xếp chọn (Selection), Chèn (Insertion) và Nổi bọt (Bubble)",
      "Hiểu ý nghĩa ký pháp Big-O và xếp hạng thứ tự tăng trưởng: O(1) < O(log n) < O(n) < O(n log n) < O(n²)",
      "Vận dụng phương pháp thiết kế chương trình từ trên xuống (Top-down) và mô-đun hóa",
    ],
    content_markdown: `## 1. Thuật toán Tìm kiếm
- **Tìm kiếm tuần tự (Linear Search):** Duyệt từng phần tử từ đầu đến cuối danh sách.
  - Áp dụng: Mọi danh sách (chưa sắp xếp hoặc đã sắp xếp).
  - Độ phức tạp thời gian: $O(n)$.
- **Tìm kiếm nhị phân (Binary Search):** 
  - Điều kiện tiên quyết: **Dữ liệu BẮT BUỘC ĐÃ ĐƯỢC SẮP XẾP**.
  - Ý tưởng: Ở mỗi bước so sánh phần tử giữa (\`mid\`) với khóa tìm kiếm \`k\`, nếu không bằng thì thu hẹp phạm vi tìm kiếm đi một nửa.
  - Độ phức tạp thời gian: $O(\\log n)$ — cực kỳ nhanh với dữ liệu lớn.

## 2. Các thuật toán Sắp xếp cơ bản
1. **Sắp xếp chọn (Selection Sort):**
   - Tìm phần tử nhỏ nhất trong dãy chưa sắp xếp, đổi chỗ nó về vị trí đầu của đoạn đó.
   - Độ phức tạp: Luôn là $O(n^2)$ trong mọi trường hợp.
2. **Sắp xếp chèn (Insertion Sort):**
   - Lấy từng phần tử chèn vào đúng vị trí tương đối trong đoạn con đã được sắp xếp trước đó.
   - Độ phức tạp: $O(n^2)$, nhưng nếu dãy đã gần sắp xếp thì chỉ mất $O(n)$.
3. **Sắp xếp nổi bọt (Bubble Sort):**
   - So sánh liên tiếp từng cặp phần tử liền kề; nếu nghịch thứ tự thì đổi chỗ. Các phần tử lớn sẽ dần nổi về cuối dãy.
   - Độ phức tạp: $O(n^2)$.

## 3. Ký pháp Big-O đánh giá độ phức tạp
- Big-O biểu thị tốc độ tăng của thời gian chạy hoặc dung lượng bộ nhớ khi kích thước dữ liệu đầu vào $n$ tăng dần.
- **Thứ tự độ phức tạp từ nhanh nhất đến chậm nhất:**
  $$O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2) < O(2^n) < O(n!)$$
- **Quy tắc tính:**
  - Quy tắc cộng: Các đoạn lệnh thực thi tuần tự thì lấy bậc cao nhất.
  - Quy tắc nhân: Các vòng lặp lồng nhau $k$ lần duyệt $n$ phần tử sẽ có bậc $O(n^k)$.`,
    code_snippets: [
      {
        language: "python",
        code: `# Thuật toán Tìm kiếm nhị phân (Binary Search)
def binary_search(a, k):
    left = 0
    right = len(a) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if a[mid] == k:
            return mid # Tìm thấy tại vị trí mid
        elif a[mid] < k:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1 # Không tìm thấy trong mảng`,
        caption: "Cài đặt thuật toán Tìm kiếm nhị phân đạt O(log n)"
      }
    ],
    order_index: 4,
    is_published: true,
    is_draft: false,
    xp_reward: 80,
    estimated_minutes: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ==========================================
  // LỚP 12 (SGK Kết nối tri thức - 30 bài)
  // ==========================================
  {
    id: "les-12-01",
    topic_id: "topic-12-1-2",
    grade_id: 12,
    title: "Bài 1: Trí tuệ nhân tạo (AI) – Bản chất, 5 Đặc trưng và Tác động xã hội",
    slug: "tri-tue-nhan-tao-ai-dac-trung-phan-loai",
    difficulty: "trung_binh",
    introduction: "Nắm vững bản chất của Trí tuệ nhân tạo (AI), 5 đặc trưng trí tuệ cốt lõi, phân biệt AI hẹp (ANI) và AI tổng quát (AGI), ứng dụng trong đời sống và các cảnh báo về đạo đức an toàn số.",
    learning_objectives: [
      "Trình bày định nghĩa AI và 5 đặc trưng: Học, Suy luận, Nhận thức, Xử lý ngôn ngữ tự nhiên, Giải quyết vấn đề",
      "Phân biệt rõ ràng AI hẹp (ANI - Narrow AI) và AI tổng quát (AGI - General AI)",
      "Nêu các ứng dụng thực tiễn của AI trong y tế, giao thông thông minh, giáo dục và tài chính",
      "Phân tích các rủi ro xã hội: Thất nghiệp công nghệ, video giả mạo Deepfake, thiên lệch thuật toán",
    ],
    content_markdown: `## 1. Khái niệm & 5 Đặc trưng cốt lõi của AI
**Trí tuệ nhân tạo (Artificial Intelligence - AI)** là ngành khoa học máy tính nghiên cứu cách tạo ra các hệ thống máy tính có khả năng tự động thực hiện các hành vi thông minh tương đương con người.

### 5 Đặc trưng cốt lõi của AI theo chuẩn SGK:
1. **Khả năng Học (Learning):** Tiếp thu tri thức từ dữ liệu quá khứ để tự cải thiện độ chính xác mà không cần lập trình lại quy tắc cứng.
2. **Khả năng Suy luận (Reasoning):** Vận dụng các quy tắc logic để rút ra kết luận mới từ các tiên đề hoặc dữ kiện ban đầu.
3. **Khả năng Nhận thức (Perception):** Cảm nhận và diễn giải thế giới thông qua hình ảnh (Computer Vision), âm thanh, sóng vô tuyến và các cảm biến.
4. **Khả năng Hiểu ngôn ngữ tự nhiên (NLP):** Đọc hiểu, tóm tắt, dịch thuật và đàm thoại tự nhiên với con người bằng ngôn ngữ mẹ đẻ (như ChatGPT, Gemini).
5. **Khả năng Giải quyết vấn đề (Problem Solving):** Lập kế hoạch, tìm đường đi tối ưu và ra quyết định chiến lược trong điều kiện không chắc chắn.

## 2. Phân loại AI theo mức độ năng lực
- **AI hẹp / AI yếu (ANI - Artificial Narrow Intelligence):** 
  - Chỉ tập trung giải quyết xuất sắc **một nhiệm vụ chuyên biệt duy nhất**.
  - Ví dụ: Phần mềm đánh cờ AlphaGo, thuật toán nhận diện biển số xe, trợ lý ảo Siri, hệ thống gợi ý video YouTube.
  - *Hiện nay, toàn bộ các ứng dụng AI đang triển khai trong thực tế đều thuộc nhóm ANI.*
- **AI tổng quát / AI mạnh (AGI - Artificial General Intelligence):**
  - Hệ thống trí tuệ giả định có khả năng tư duy đa lĩnh vực, tự thích nghi và sáng tạo ngang ngửa với trí tuệ con người trên mọi phương diện.

## 3. Tác động của AI đối với xã hội
- **Mặt tích cực:** Nâng cao năng suất lao động, chẩn đoán sớm ung thư qua ảnh chụp X-quang, xe tự lái giảm tai nạn giao thông, cá nhân hóa lộ trình học tập.
- **Rủi ro & Thách thức:**
  - Thay thế lao động phổ thông và văn phòng dẫn đến nguy cơ thất nghiệp.
  - Công nghệ làm giả khuôn mặt và giọng nói (**Deepfake**) phục vụ lừa đảo tinh vi.
  - Thiên lệch dữ liệu (Bias) dẫn tới các quyết định phân biệt đối xử.
  - Nguy cơ mất an toàn dữ liệu và quyền riêng tư cá nhân.`,
    code_snippets: [],
    order_index: 1,
    is_published: true,
    is_draft: false,
    xp_reward: 70,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-12-02",
    topic_id: "topic-12-1-1",
    grade_id: 12,
    title: "Bài 2: Mạng máy tính, Thiết bị kết nối Switch/Router và Giao thức TCP/IP",
    slug: "mang-may-tinh-va-giao-thuc-tcp-ip",
    difficulty: "trung_binh",
    introduction: "Khám phá cấu trúc mạng máy tính hiện đại: Chức năng của Switch, Router, Access Point, Modem; kiến trúc địa chỉ IPv4/IPv6; cơ chế hoạt động của TCP, IP, DNS và HTTPS.",
    learning_objectives: [
      "Phân biệt chính xác chức năng chuyển mạch của Switch (dựa vào MAC) và định tuyến của Router (dựa vào IP)",
      "Hiểu vai trò của Access Point (Wi-Fi) và Modem trong việc đưa mạng nội bộ ra Internet",
      "Giải thích cơ chế phân giải tên miền của máy chủ DNS và mã hóa bảo mật HTTPS",
      "Thiết lập chia sẻ tệp và máy in trong mạng nội bộ LAN an toàn",
    ],
    content_markdown: `## 1. Các thiết bị mạng cốt lõi
- **Switch (Bộ chuyển mạch):**
  - Kết nối các máy tính trong cùng một mạng cục bộ (LAN).
  - Hoạt động dựa trên bảng địa chỉ vật lý **MAC**: Khi nhận một khung dữ liệu (Frame), Switch chỉ gửi khung đó đến đúng cổng của thiết bị nhận, giúp tránh xung đột đường truyền.
- **Router (Bộ định tuyến):**
  - Kết nối hai hoặc nhiều mạng độc lập với nhau (ví dụ kết nối mạng LAN của trường học với mạng Internet toàn cầu).
  - Hoạt động dựa trên địa chỉ **IP**: Tìm đường đi tối ưu cho từng gói tin (Packet) qua các trạm mạng trung gian.
- **Access Point (AP - Điểm truy cập không dây):**
  - Phát sóng Wi-Fi để mở rộng kết nối không dây cho laptop, smartphone vào mạng LAN có dây.
- **Modem:**
  - Thiết bị điều chế (Modulation) và giải điều chế (Demodulation) tín hiệu để chuyển đổi tín hiệu số của máy tính sang tín hiệu tương tự trên đường truyền viễn thông (cáp quang, cáp đồng) của nhà mạng ISP.

## 2. Bộ giao thức truyền thông TCP/IP
- **Địa chỉ IP:** Địa chỉ logic dùng để định danh duy nhất mỗi thiết bị tham gia mạng.
  - **IPv4:** Dài 32 bit, viết dưới dạng 4 số thập phân cách nhau bởi dấu chấm, ví dụ: \`192.168.1.1\` (giới hạn khoảng 4.3 tỷ địa chỉ).
  - **IPv6:** Dài 128 bit, viết dưới dạng các cụm số thập lục phân (Hex), cung cấp không gian địa chỉ gần như vô hạn.
- **TCP (Transmission Control Protocol):** Đảm bảo truyền dữ liệu **tin cậy tuyệt đối**; kiểm tra lỗi, yêu cầu gửi lại gói tin bị mất và ghép các gói tin theo đúng thứ tự ban đầu.
- **IP (Internet Protocol):** Đảm nhiệm việc đóng gói dữ liệu và định tuyến gói tin từ máy gửi đến máy nhận.
- **DNS (Domain Name System):** Dịch vụ chuyển đổi tên miền dễ nhớ (như \`itmaster.edu.vn\`) thành địa chỉ IP số mà máy tính hiểu được.
- **HTTP vs HTTPS:** Giao thức truyền tải trang web; HTTPS được mã hóa an toàn qua giao thức bảo mật SSL/TLS để chống nghe lén dữ liệu.`,
    code_snippets: [],
    order_index: 2,
    is_published: true,
    is_draft: false,
    xp_reward: 65,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-12-03",
    topic_id: "topic-12-2-1",
    grade_id: 12,
    title: "Bài 3: Thiết kế trang web với HTML5, CSS3 và Mô hình hộp Box Model",
    slug: "thiet-ke-web-html5-css3-box-model",
    difficulty: "trung_binh",
    introduction: "Làm chủ cấu trúc trang web chuẩn HTML5, các thẻ bảng, biểu mẫu Form, và nguyên lý định dạng CSS3 chuyên nghiệp với Mô hình hộp (Box Model) và độ ưu tiên bộ chọn (Specificity).",
    learning_objectives: [
      "Xây dựng khung cấu trúc tài liệu HTML5 chuẩn với head, meta, title, body",
      "Tạo bảng dữ liệu với thẻ table, tr, th, td và gộp ô bằng colspan, rowspan",
      "Thiết kế biểu mẫu Form nhận thông tin người dùng với các loại thẻ input phong phú",
      "Giải thích và áp dụng mô hình hộp Box Model: Content, Padding, Border, Margin",
      "Xác định độ ưu tiên của bộ chọn CSS: !important > Inline > #id > .class > tag",
    ],
    content_markdown: `## 1. Cấu trúc tài liệu HTML5 chuẩn
\`\`\`html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiêu đề trang web</title>
</head>
<body>
    <h1>Chào mừng đến với môn Tin học THPT</h1>
    <p>Nội dung trang web hiển thị tại đây.</p>
</body>
</html>
\`\`\`

## 2. Các thẻ HTML5 cốt lõi
- **Định dạng văn bản:** \`<h1>\`-\`<h6>\` (tiêu đề), \`<p>\` (đoạn văn), \`<strong>\` (in đậm ngữ nghĩa), \`<em>\` (in nghiêng nhấn mạnh).
- **Danh sách:** \`<ul>\` (danh sách không thứ tự), \`<ol>\` (danh sách có số thứ tự), \`<li>\` (từng mục).
- **Bảng (Table):** \`<table>\`, \`<tr>\` (hàng), \`<th>\` (ô tiêu đề), \`<td>\` (ô dữ liệu). Thuộc tính \`colspan="k"\` (gộp $k$ cột), \`rowspan="k"\` (gộp $k$ hàng).
- **Biểu mẫu (Form):** Nhận tương tác của người dùng:
  - \`<input type="text">\`: Nhập văn bản một dòng.
  - \`<input type="password">\`: Nhập mật khẩu ẩn ký tự.
  - \`<input type="radio">\`: Chọn 1 trong nhiều phương án.
  - \`<input type="checkbox">\`: Chọn nhiều phương án cùng lúc.
  - \`<select>\` kèm các \`<option>\`: Hộp chọn thả xuống (Dropdown).

## 3. CSS3 & Mô hình hộp (Box Model)
- **3 phương pháp chèn CSS:**
  1. *Inline Style:* Viết trực tiếp trong thuộc tính \`style="..."\` của thẻ.
  2. *Internal CSS:* Đặt trong thẻ \`<style>\` ở phần \`<head>\`.
  3. *External CSS (Khuyên dùng):* Tạo tệp \`.css\` riêng và liên kết bằng thẻ \`<link rel="stylesheet" href="style.css">\`.
- **Mô hình hộp (Box Model):**
  - **Content (Nội dung):** Kích thước thật của chữ hoặc ảnh.
  - **Padding (Khoảng đệm):** Khoảng trống giữa nội dung và đường viền.
  - **Border (Đường viền):** Bao quanh phần đệm và nội dung.
  - **Margin (Lề ngoài):** Khoảng cách từ đường viền ra các phần tử lân cận.
- **Thứ tự ưu tiên bộ chọn (Specificity):**
  $$\\text{!important} > \\text{Inline Style} > \\text{#id} > \\text{.class / :pseudo-class} > \\text{Tên thẻ (Tag)}$$`,
    code_snippets: [
      {
        language: "css",
        code: `/* Minh họa quy tắc Box Model chuẩn mực */
.box-hoc-tap {
    width: 300px;
    background-color: #f8fafc;
    padding: 16px;              /* Khoảng đệm 16px */
    border: 2px solid #3b82f6;  /* Đường viền xanh 2px */
    border-radius: 8px;
    margin: 24px auto;          /* Lề trên dưới 24px, căn giữa ngang */
    box-sizing: border-box;
}`,
        caption: "Quy tắc định dạng CSS Box Model"
      }
    ],
    order_index: 3,
    is_published: true,
    is_draft: false,
    xp_reward: 70,
    estimated_minutes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-12-04",
    topic_id: "topic-12-1-2",
    grade_id: 12,
    title: "Bài 4: (CS) Học máy (Machine Learning), Khoa học dữ liệu và Mô phỏng",
    slug: "hoc-may-khoa-hoc-du-lieu-big-data",
    difficulty: "nang_cao",
    introduction: "Khám phá định hướng Khoa học máy tính Lớp 12: 3 nhánh chính của Machine Learning, quy trình 5 bước của Khoa học dữ liệu, đặc trưng Dữ liệu lớn (Big Data 5V) và ứng dụng phần mềm mô phỏng.",
    learning_objectives: [
      "Phân biệt 3 nhánh Học máy: Học có giám sát, Học không giám sát và Học tăng cường",
      "Phân biệt bài toán Phân loại (Classification) và Hồi quy (Regression)",
      "Trình bày quy trình 5 bước khai phá tri thức trong Khoa học dữ liệu",
      "Nắm vững 5 đặc trưng cốt lõi của Big Data: Volume, Velocity, Variety, Veracity, Value",
    ],
    content_markdown: `## 1. Các nhánh của Học máy (Machine Learning)
Học máy là nhánh con trọng tâm của AI, tập trung xây dựng các thuật toán cho phép máy tính tự học hỏi quy luật từ dữ liệu để đưa ra dự báo.

### 3 Phương pháp học máy cốt lõi:
1. **Học có giám sát (Supervised Learning):**
   - Dữ liệu huấn luyện gồm cả dữ liệu đầu vào và **nhãn đầu ra chính xác** (Label).
   - Chia làm 2 bài toán:
     - *Phân loại (Classification):* Đầu ra là các nhãn rời rạc (Ví dụ: Thư rác/Không phải thư rác, Bệnh nhân mắc bệnh/Khỏe mạnh).
     - *Hồi quy (Regression):* Đầu ra là giá trị số liên tục (Ví dụ: Dự báo nhiệt độ ngày mai, dự báo giá nhà theo diện tích).
2. **Học không giám sát (Unsupervised Learning):**
   - Dữ liệu đầu vào **hoàn toàn không có nhãn**. Thuật toán tự tìm các cấu trúc, cụm ẩn trong dữ liệu.
   - Bài toán điển hình: *Phân cụm (Clustering)* phân nhóm khách hàng theo sở thích mua sắm.
3. **Học tăng cường (Reinforcement Learning):**
   - Tác tử (Agent) tự hành động trong môi trường và học cách tối đa hóa điểm thưởng (Reward) thông qua cơ chế thử và sai.
   - Ứng dụng: Robot học đi, phần mềm chơi cờ vây AlphaGo, điều khiển xe tự hành.

## 2. Khoa học dữ liệu & Dữ liệu lớn (Big Data)
### Quy trình 5 bước của Khoa học dữ liệu:
1. **Thu thập dữ liệu:** Lấy từ nhiều nguồn (Cảm biến, mạng xã hội, tệp tin log).
2. **Tiền xử lý và làm sạch dữ liệu:** Xử lý dữ liệu khuyết thiếu, loại bỏ dữ liệu nhiễu, chuẩn hóa định dạng.
3. **Khám phá và trực quan hóa:** Vẽ biểu đồ hình cột, phân tán để nhận định xu hướng sơ bộ.
4. **Xây dựng mô hình (Modeling):** Huấn luyện mô hình học máy.
5. **Đánh giá và trích xuất tri thức:** Kiểm định độ chính xác và đưa mô hình vào ứng dụng thực tế.

### 5 Đặc trưng cốt lõi của Dữ liệu lớn (Big Data 5V):
1. **Volume (Khối lượng):** Quy mô dữ liệu khổng lồ (hàng Terabyte đến Petabyte).
2. **Velocity (Tốc độ):** Dữ liệu được sinh ra và yêu cầu xử lý tức thời theo thời gian thực.
3. **Variety (Đa dạng):** Dữ liệu có cấu trúc (bảng SQL), bán cấu trúc (JSON, XML) và phi cấu trúc (ảnh, video, audio).
4. **Veracity (Tính xác thực):** Độ tin cậy và chất lượng chuẩn xác của dữ liệu.
5. **Value (Giá trị):** Giá trị kinh tế và tri thức mang lại cho con người.

## 3. Mô phỏng trong khoa học và giáo dục
- Xây dựng mô hình toán học và phần mềm mô phỏng các hiện tượng phức tạp trong tự nhiên (PhET, GeoGebra).
- Lợi ích: Cho phép thử nghiệm an toàn, lặp lại nhiều lần với chi phí thấp đối với các thí nghiệm nguy hiểm hoặc tốn kém trong thực tế.`,
    code_snippets: [],
    order_index: 4,
    is_published: true,
    is_draft: false,
    xp_reward: 80,
    estimated_minutes: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "les-12-05",
    topic_id: "topic-12-2-1",
    grade_id: 12,
    title: "Bài 5: Hướng nghiệp – Các nhóm nghề trong kỷ nguyên Công nghệ số",
    slug: "huong-nghiep-cong-nghe-thong-tin-12",
    difficulty: "co_ban",
    introduction: "Khái quát bức tranh nghề nghiệp toàn diện bộ môn Tin học THPT: Nghề Quản trị mạng, Quản trị hệ thống, An toàn thông tin (Cybersecurity), Quản trị CSDL (DBA) và Thiết kế đồ họa.",
    learning_objectives: [
      "Trình bày nhiệm vụ của nhóm nghề Quản trị mạng và Quản trị hệ thống máy tính",
      "Hiểu tầm quan trọng của chuyên viên An toàn thông tin và bảo mật mạng (Cybersecurity)",
      "Nêu các yêu cầu về phẩm chất, năng lực và kỹ năng cần chuẩn bị khi theo đuổi ngành CNTT",
    ],
    content_markdown: `## 1. Nhóm nghề Quản trị hệ thống & Mạng máy tính
- **Quản trị mạng (Network Administrator):**
  - Chịu trách nhiệm thiết kế, lắp đặt, cấu hình các thiết bị Switch, Router, Firewall; giám sát đường truyền băng thông và đảm bảo kết nối mạng của tổ chức luôn thông suốt.
- **Quản trị hệ thống (System Administrator - SysAdmin):**
  - Cài đặt, bảo trì máy chủ (Windows Server, Linux), quản lý tài khoản người dùng, phân quyền truy cập và sao lưu dữ liệu hệ thống định kỳ.
- **Bảo trì và sửa chữa máy tính:**
  - Chẩn đoán, xử lý sự cố phần cứng, nâng cấp linh kiện (RAM, SSD, card đồ họa) và cài đặt hệ điều hành.

## 2. Nhóm nghề An toàn thông tin & An ninh mạng (Cybersecurity)
- Đảm bảo tính bảo mật (Confidentiality), tính toàn vẹn (Integrity) và tính sẵn sàng (Availability) của hệ thống thông tin.
- Nhiệm vụ: Thiết lập tường lửa, kiểm thử xâm nhập (Penetration Testing), giám sát phát hiện tấn công mạng, xử lý mã độc và điều tra sự cố số.
- Đòi hỏi kiến thức sâu về hệ điều hành, giao thức mạng, mật mã học và đạo đức nghề nghiệp nghiêm ngặt.

## 3. Năng lực cần chuẩn bị cho học sinh THPT
1. **Năng lực tư duy giải thuật & lập trình:** Thành thạo ít nhất một ngôn ngữ hiện đại (Python, C++, SQL).
2. **Kỹ năng tự học và nghiên cứu tài liệu:** Công nghệ thay đổi liên tục, khả năng đọc hiểu tài liệu chuyên ngành bằng tiếng Anh là yếu tố quyết định.
3. **Kỹ năng mềm:** Làm việc nhóm, giao tiếp, tư duy phản biện và quản lý thời gian hiệu quả.`,
    code_snippets: [],
    order_index: 5,
    is_published: true,
    is_draft: false,
    xp_reward: 50,
    estimated_minutes: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
