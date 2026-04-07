<?php
// ─── PART 1: DATABASE CONNECTION ────────────────────────────────
$host   = "localhost";
$dbname = "my_database";
$user   = "root";
$pass   = "";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// ─── PART 2: INSERT — handle form submission ─────────────────────
$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = mysqli_real_escape_string($conn, $_POST["first_name"]);
    $last_name  = mysqli_real_escape_string($conn, $_POST["last_name"]);
    $email      = mysqli_real_escape_string($conn, $_POST["email"]);
    $password   = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (first_name, last_name, email, password)
            VALUES ('$first_name', '$last_name', '$email', '$password')";

    if (mysqli_query($conn, $sql)) {
        $message = "<p class='success'>User registered successfully!</p>";
    } else {
        $message = "<p class='error'>Error: " . mysqli_error($conn) . "</p>";
    }
}

// ─── PART 3: SELECT — fetch all users ───────────────────────────
$result = mysqli_query($conn, "SELECT first_name, last_name, email, password FROM users");
?>
<!DOCTYPE html>
<html>
<head>
    <title>User Registration</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            color: #333;
        }

        .container {
            max-width: 700px;
            margin: 50px auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }

        h1, h2 { font-weight: 500; margin-bottom: 16px; }
        h1 { font-size: 22px; }
        h2 { font-size: 18px; margin-top: 36px; }

        label {
            display: block;
            margin-top: 14px;
            margin-bottom: 4px;
            font-size: 14px;
            color: #555;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 9px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        button[type="submit"] {
            margin-top: 20px;
            padding: 10px 24px;
            background-color: #534AB7;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
        }

        button[type="submit"]:hover { background-color: #3C3489; }

        .success {
            background: #E1F5EE;
            color: #085041;
            padding: 10px 14px;
            border-radius: 6px;
            margin-bottom: 16px;
            font-size: 14px;
        }

        .error {
            background: #FCEBEB;
            color: #791F1F;
            padding: 10px 14px;
            border-radius: 6px;
            margin-bottom: 16px;
            font-size: 14px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-top: 10px;
        }

        th {
            text-align: left;
            padding: 10px 12px;
            background: #f4f4f4;
            border-bottom: 1px solid #ddd;
            font-weight: 500;
            color: #444;
        }

        td {
            padding: 10px 12px;
            border-bottom: 1px solid #eee;
            word-break: break-all;
        }

        tr:last-child td { border-bottom: none; }

        hr { border: none; border-top: 1px solid #eee; margin: 30px 0; }
    </style>
</head>
<body>
<div class="container">

    <h1>Register</h1>

    <?php echo $message; ?>

    <!-- Registration Form (Part 2) -->
    <form method="POST" action="">
        <label>First Name</label>
        <input type="text" name="first_name" placeholder="Enter first name" required>

        <label>Last Name</label>
        <input type="text" name="last_name" placeholder="Enter last name" required>

        <label>Email</label>
        <input type="email" name="email" placeholder="Enter email" required>

        <label>Password</label>
        <input type="password" name="password" placeholder="Enter password" required>

        <button type="submit">Register</button>
    </form>

    <hr>

    <!-- Display Users (Part 3) -->
    <h2>All Users</h2>

    <?php if (mysqli_num_rows($result) > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Password (hashed)</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = mysqli_fetch_assoc($result)): ?>
                <tr>
                    <td><?php echo $row["first_name"]; ?></td>
                    <td><?php echo $row["last_name"]; ?></td>
                    <td><?php echo $row["email"]; ?></td>
                    <td><?php echo substr($row["password"], 0, 30) . "..."; ?></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p style="font-size:14px; color:#888;">No users yet. Register one above.</p>
    <?php endif; ?>

</div>
</body>
</html>
<?php mysqli_close($conn); ?>
