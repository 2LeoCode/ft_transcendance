import smtplib


gmail_user = 'transcendance.42.noreply@gmail.com'

gmail_password = '(Transcendance42)?'

sent_from = gmail_user

to = 'noctuss86@gmail.com'

subject = 'Hello world'

body = 'Hello world'


email_text = """\

From: %s

To: %s

Subject: %s


%s

""" % (sent_from, to, subject, body)


try:
	smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
	smtp_server.ehlo()
	smtp_server.starttls()
	smtp_server.ehlo()
	smtp_server.login(gmail_user, gmail_password)
	smtp_server.sendmail(sent_from, to, email_text)
	smtp_server.close()
	print ("Email sent successfully!")

except Exception as ex:
	print ("Something went wrong….",ex)