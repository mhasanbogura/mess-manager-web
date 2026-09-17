.class public final La41;
.super Lo41;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# instance fields
.field public e:I

.field public f:Lp71;

.field public g:Landroid/app/PendingIntent;

.field public h:Landroid/app/PendingIntent;

.field public i:Landroid/app/PendingIntent;

.field public j:Z

.field public k:Ljava/lang/Integer;

.field public l:Ljava/lang/Integer;

.field public m:Landroidx/core/graphics/drawable/IconCompat;

.field public n:Ljava/lang/CharSequence;


# virtual methods
.method public final a(Landroid/os/Bundle;)V
    .locals 3

    .line 1
    invoke-super {p0, p1}, Lo41;->a(Landroid/os/Bundle;)V

    .line 2
    .line 3
    .line 4
    const-string v0, "android.callType"

    .line 5
    .line 6
    iget v1, p0, La41;->e:I

    .line 7
    .line 8
    invoke-virtual {p1, v0, v1}, Landroid/os/BaseBundle;->putInt(Ljava/lang/String;I)V

    .line 9
    .line 10
    .line 11
    const-string v0, "android.callIsVideo"

    .line 12
    .line 13
    iget-boolean v1, p0, La41;->j:Z

    .line 14
    .line 15
    invoke-virtual {p1, v0, v1}, Landroid/os/BaseBundle;->putBoolean(Ljava/lang/String;Z)V

    .line 16
    .line 17
    .line 18
    iget-object v0, p0, La41;->f:Lp71;

    .line 19
    .line 20
    if-eqz v0, :cond_1

    .line 21
    .line 22
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    .line 23
    .line 24
    const/16 v2, 0x1c

    .line 25
    .line 26
    if-lt v1, v2, :cond_0

    .line 27
    .line 28
    invoke-static {v0}, Lx4;->B(Lp71;)Landroid/app/Person;

    .line 29
    .line 30
    .line 31
    move-result-object v0

    .line 32
    invoke-static {v0}, Ly31;->b(Landroid/app/Person;)Landroid/os/Parcelable;

    .line 33
    .line 34
    .line 35
    move-result-object v0

    .line 36
    const-string v1, "android.callPerson"

    .line 37
    .line 38
    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 39
    .line 40
    .line 41
    goto :goto_0

    .line 42
    :cond_0
    const-string v1, "android.callPersonCompat"

    .line 43
    .line 44
    invoke-virtual {v0}, Lp71;->b()Landroid/os/Bundle;

    .line 45
    .line 46
    .line 47
    move-result-object v0

    .line 48
    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 49
    .line 50
    .line 51
    :cond_1
    :goto_0
    iget-object v0, p0, La41;->m:Landroidx/core/graphics/drawable/IconCompat;

    .line 52
    .line 53
    if-eqz v0, :cond_2

    .line 54
    .line 55
    iget-object v1, p0, Lo41;->a:Lx31;

    .line 56
    .line 57
    iget-object v1, v1, Lx31;->a:Landroid/content/Context;

    .line 58
    .line 59
    invoke-virtual {v0, v1}, Landroidx/core/graphics/drawable/IconCompat;->h(Landroid/content/Context;)Landroid/graphics/drawable/Icon;

    .line 60
    .line 61
    .line 62
    move-result-object v0

    .line 63
    const-string v1, "android.verificationIcon"

    .line 64
    .line 65
    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 66
    .line 67
    .line 68
    :cond_2
    const-string v0, "android.verificationText"

    .line 69
    .line 70
    iget-object v1, p0, La41;->n:Ljava/lang/CharSequence;

    .line 71
    .line 72
    invoke-virtual {p1, v0, v1}, Landroid/os/Bundle;->putCharSequence(Ljava/lang/String;Ljava/lang/CharSequence;)V

    .line 73
    .line 74
    .line 75
    const-string v0, "android.answerIntent"

    .line 76
    .line 77
    iget-object v1, p0, La41;->g:Landroid/app/PendingIntent;

    .line 78
    .line 79
    invoke-virtual {p1, v0, v1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 80
    .line 81
    .line 82
    const-string v0, "android.declineIntent"

    .line 83
    .line 84
    iget-object v1, p0, La41;->h:Landroid/app/PendingIntent;

    .line 85
    .line 86
    invoke-virtual {p1, v0, v1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 87
    .line 88
    .line 89
    const-string v0, "android.hangUpIntent"

    .line 90
    .line 91
    iget-object v1, p0, La41;->i:Landroid/app/PendingIntent;

    .line 92
    .line 93
    invoke-virtual {p1, v0, v1}, Landroid/os/Bundle;->putParcelable(Ljava/lang/String;Landroid/os/Parcelable;)V

    .line 94
    .line 95
    .line 96
    iget-object v0, p0, La41;->k:Ljava/lang/Integer;

    .line 97
    .line 98
    if-eqz v0, :cond_3

    .line 99
    .line 100
    const-string v1, "android.answerColor"

    .line 101
    .line 102
    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    .line 103
    .line 104
    .line 105
    move-result v0

    .line 106
    invoke-virtual {p1, v1, v0}, Landroid/os/BaseBundle;->putInt(Ljava/lang/String;I)V

    .line 107
    .line 108
    .line 109
    :cond_3
    iget-object p0, p0, La41;->l:Ljava/lang/Integer;

    .line 110
    .line 111
    if-eqz p0, :cond_4

    .line 112
    .line 113
    const-string v0, "android.declineColor"

    .line 114
    .line 115
    invoke-virtual {p0}, Ljava/lang/Integer;->intValue()I

    .line 116
    .line 117
    .line 118
    move-result p0

    .line 119
    invoke-virtual {p1, v0, p0}, Landroid/os/BaseBundle;->putInt(Ljava/lang/String;I)V

    .line 120
    .line 121
    .line 122
    :cond_4
    return-void
.end method

.method public final b(Lkg2;)V
    .locals 7

    .line 1
    iget-object p1, p1, Lkg2;->d:Ljava/lang/Object;

    .line 2
    .line 3
    check-cast p1, Landroid/app/Notification$Builder;

    .line 4
    .line 5
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    .line 6
    .line 7
    const/16 v1, 0x1f

    .line 8
    .line 9
    const/4 v2, 0x2

    .line 10
    const/4 v3, 0x1

    .line 11
    const/4 v4, 0x3

    .line 12
    const/4 v5, 0x0

    .line 13
    if-lt v0, v1, :cond_8

    .line 14
    .line 15
    iget v0, p0, La41;->e:I

    .line 16
    .line 17
    if-eq v0, v3, :cond_2

    .line 18
    .line 19
    if-eq v0, v2, :cond_1

    .line 20
    .line 21
    if-eq v0, v4, :cond_0

    .line 22
    .line 23
    const-string v0, "NotifCompat"

    .line 24
    .line 25
    invoke-static {v0, v4}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 26
    .line 27
    .line 28
    move-result v1

    .line 29
    if-eqz v1, :cond_3

    .line 30
    .line 31
    new-instance v1, Ljava/lang/StringBuilder;

    .line 32
    .line 33
    const-string v2, "Unrecognized call type in CallStyle: "

    .line 34
    .line 35
    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 36
    .line 37
    .line 38
    iget v2, p0, La41;->e:I

    .line 39
    .line 40
    invoke-static {v2}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    .line 41
    .line 42
    .line 43
    move-result-object v2

    .line 44
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 45
    .line 46
    .line 47
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 48
    .line 49
    .line 50
    move-result-object v1

    .line 51
    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 52
    .line 53
    .line 54
    goto :goto_0

    .line 55
    :cond_0
    iget-object v0, p0, La41;->f:Lp71;

    .line 56
    .line 57
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 58
    .line 59
    .line 60
    invoke-static {v0}, Lx4;->B(Lp71;)Landroid/app/Person;

    .line 61
    .line 62
    .line 63
    move-result-object v0

    .line 64
    iget-object v1, p0, La41;->i:Landroid/app/PendingIntent;

    .line 65
    .line 66
    iget-object v2, p0, La41;->g:Landroid/app/PendingIntent;

    .line 67
    .line 68
    invoke-static {v0, v1, v2}, Lz31;->c(Landroid/app/Person;Landroid/app/PendingIntent;Landroid/app/PendingIntent;)Landroid/app/Notification$CallStyle;

    .line 69
    .line 70
    .line 71
    move-result-object v5

    .line 72
    goto :goto_0

    .line 73
    :cond_1
    iget-object v0, p0, La41;->f:Lp71;

    .line 74
    .line 75
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 76
    .line 77
    .line 78
    invoke-static {v0}, Lx4;->B(Lp71;)Landroid/app/Person;

    .line 79
    .line 80
    .line 81
    move-result-object v0

    .line 82
    iget-object v1, p0, La41;->i:Landroid/app/PendingIntent;

    .line 83
    .line 84
    invoke-static {v0, v1}, Lz31;->b(Landroid/app/Person;Landroid/app/PendingIntent;)Landroid/app/Notification$CallStyle;

    .line 85
    .line 86
    .line 87
    move-result-object v5

    .line 88
    goto :goto_0

    .line 89
    :cond_2
    iget-object v0, p0, La41;->f:Lp71;

    .line 90
    .line 91
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 92
    .line 93
    .line 94
    invoke-static {v0}, Lx4;->B(Lp71;)Landroid/app/Person;

    .line 95
    .line 96
    .line 97
    move-result-object v0

    .line 98
    iget-object v1, p0, La41;->h:Landroid/app/PendingIntent;

    .line 99
    .line 100
    iget-object v2, p0, La41;->g:Landroid/app/PendingIntent;

    .line 101
    .line 102
    invoke-static {v0, v1, v2}, Lz31;->a(Landroid/app/Person;Landroid/app/PendingIntent;Landroid/app/PendingIntent;)Landroid/app/Notification$CallStyle;

    .line 103
    .line 104
    .line 105
    move-result-object v5

    .line 106
    :cond_3
    :goto_0
    if-eqz v5, :cond_7

    .line 107
    .line 108
    invoke-virtual {v5, p1}, Landroid/app/Notification$CallStyle;->setBuilder(Landroid/app/Notification$Builder;)V

    .line 109
    .line 110
    .line 111
    iget-object p1, p0, La41;->k:Ljava/lang/Integer;

    .line 112
    .line 113
    if-eqz p1, :cond_4

    .line 114
    .line 115
    invoke-virtual {p1}, Ljava/lang/Integer;->intValue()I

    .line 116
    .line 117
    .line 118
    move-result p1

    .line 119
    invoke-static {v5, p1}, Lz31;->d(Landroid/app/Notification$CallStyle;I)Landroid/app/Notification$CallStyle;

    .line 120
    .line 121
    .line 122
    :cond_4
    iget-object p1, p0, La41;->l:Ljava/lang/Integer;

    .line 123
    .line 124
    if-eqz p1, :cond_5

    .line 125
    .line 126
    invoke-virtual {p1}, Ljava/lang/Integer;->intValue()I

    .line 127
    .line 128
    .line 129
    move-result p1

    .line 130
    invoke-static {v5, p1}, Lz31;->e(Landroid/app/Notification$CallStyle;I)Landroid/app/Notification$CallStyle;

    .line 131
    .line 132
    .line 133
    :cond_5
    iget-object p1, p0, La41;->n:Ljava/lang/CharSequence;

    .line 134
    .line 135
    invoke-static {v5, p1}, Lz31;->h(Landroid/app/Notification$CallStyle;Ljava/lang/CharSequence;)Landroid/app/Notification$CallStyle;

    .line 136
    .line 137
    .line 138
    iget-object p1, p0, La41;->m:Landroidx/core/graphics/drawable/IconCompat;

    .line 139
    .line 140
    if-eqz p1, :cond_6

    .line 141
    .line 142
    iget-object v0, p0, Lo41;->a:Lx31;

    .line 143
    .line 144
    iget-object v0, v0, Lx31;->a:Landroid/content/Context;

    .line 145
    .line 146
    invoke-virtual {p1, v0}, Landroidx/core/graphics/drawable/IconCompat;->h(Landroid/content/Context;)Landroid/graphics/drawable/Icon;

    .line 147
    .line 148
    .line 149
    move-result-object p1

    .line 150
    invoke-static {v5, p1}, Lz31;->g(Landroid/app/Notification$CallStyle;Landroid/graphics/drawable/Icon;)Landroid/app/Notification$CallStyle;

    .line 151
    .line 152
    .line 153
    :cond_6
    iget-boolean p0, p0, La41;->j:Z

    .line 154
    .line 155
    invoke-static {v5, p0}, Lz31;->f(Landroid/app/Notification$CallStyle;Z)Landroid/app/Notification$CallStyle;

    .line 156
    .line 157
    .line 158
    :cond_7
    return-void

    .line 159
    :cond_8
    iget-object v1, p0, La41;->f:Lp71;

    .line 160
    .line 161
    if-eqz v1, :cond_9

    .line 162
    .line 163
    iget-object v1, v1, Lp71;->a:Ljava/lang/CharSequence;

    .line 164
    .line 165
    goto :goto_1

    .line 166
    :cond_9
    move-object v1, v5

    .line 167
    :goto_1
    invoke-virtual {p1, v1}, Landroid/app/Notification$Builder;->setContentTitle(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    .line 168
    .line 169
    .line 170
    iget-object v1, p0, Lo41;->a:Lx31;

    .line 171
    .line 172
    iget-object v1, v1, Lx31;->y:Landroid/os/Bundle;

    .line 173
    .line 174
    if-eqz v1, :cond_a

    .line 175
    .line 176
    const-string v6, "android.text"

    .line 177
    .line 178
    invoke-virtual {v1, v6}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 179
    .line 180
    .line 181
    move-result v1

    .line 182
    if-eqz v1, :cond_a

    .line 183
    .line 184
    iget-object v1, p0, Lo41;->a:Lx31;

    .line 185
    .line 186
    iget-object v1, v1, Lx31;->y:Landroid/os/Bundle;

    .line 187
    .line 188
    invoke-virtual {v1, v6}, Landroid/os/Bundle;->getCharSequence(Ljava/lang/String;)Ljava/lang/CharSequence;

    .line 189
    .line 190
    .line 191
    move-result-object v1

    .line 192
    goto :goto_2

    .line 193
    :cond_a
    move-object v1, v5

    .line 194
    :goto_2
    if-nez v1, :cond_e

    .line 195
    .line 196
    iget v1, p0, La41;->e:I

    .line 197
    .line 198
    if-eq v1, v3, :cond_d

    .line 199
    .line 200
    if-eq v1, v2, :cond_c

    .line 201
    .line 202
    if-eq v1, v4, :cond_b

    .line 203
    .line 204
    goto :goto_3

    .line 205
    :cond_b
    iget-object v1, p0, Lo41;->a:Lx31;

    .line 206
    .line 207
    iget-object v1, v1, Lx31;->a:Landroid/content/Context;

    .line 208
    .line 209
    invoke-virtual {v1}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 210
    .line 211
    .line 212
    move-result-object v1

    .line 213
    const v2, 0x7f0e0024

    .line 214
    .line 215
    .line 216
    invoke-virtual {v1, v2}, Landroid/content/res/Resources;->getString(I)Ljava/lang/String;

    .line 217
    .line 218
    .line 219
    move-result-object v5

    .line 220
    goto :goto_3

    .line 221
    :cond_c
    iget-object v1, p0, Lo41;->a:Lx31;

    .line 222
    .line 223
    iget-object v1, v1, Lx31;->a:Landroid/content/Context;

    .line 224
    .line 225
    invoke-virtual {v1}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 226
    .line 227
    .line 228
    move-result-object v1

    .line 229
    const v2, 0x7f0e0023

    .line 230
    .line 231
    .line 232
    invoke-virtual {v1, v2}, Landroid/content/res/Resources;->getString(I)Ljava/lang/String;

    .line 233
    .line 234
    .line 235
    move-result-object v5

    .line 236
    goto :goto_3

    .line 237
    :cond_d
    iget-object v1, p0, Lo41;->a:Lx31;

    .line 238
    .line 239
    iget-object v1, v1, Lx31;->a:Landroid/content/Context;

    .line 240
    .line 241
    invoke-virtual {v1}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 242
    .line 243
    .line 244
    move-result-object v1

    .line 245
    const v2, 0x7f0e0022

    .line 246
    .line 247
    .line 248
    invoke-virtual {v1, v2}, Landroid/content/res/Resources;->getString(I)Ljava/lang/String;

    .line 249
    .line 250
    .line 251
    move-result-object v5

    .line 252
    :goto_3
    move-object v1, v5

    .line 253
    :cond_e
    invoke-virtual {p1, v1}, Landroid/app/Notification$Builder;->setContentText(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    .line 254
    .line 255
    .line 256
    iget-object v1, p0, La41;->f:Lp71;

    .line 257
    .line 258
    if-eqz v1, :cond_11

    .line 259
    .line 260
    iget-object v1, v1, Lp71;->b:Landroidx/core/graphics/drawable/IconCompat;

    .line 261
    .line 262
    if-eqz v1, :cond_f

    .line 263
    .line 264
    iget-object v2, p0, Lo41;->a:Lx31;

    .line 265
    .line 266
    iget-object v2, v2, Lx31;->a:Landroid/content/Context;

    .line 267
    .line 268
    invoke-virtual {v1, v2}, Landroidx/core/graphics/drawable/IconCompat;->h(Landroid/content/Context;)Landroid/graphics/drawable/Icon;

    .line 269
    .line 270
    .line 271
    move-result-object v1

    .line 272
    invoke-virtual {p1, v1}, Landroid/app/Notification$Builder;->setLargeIcon(Landroid/graphics/drawable/Icon;)Landroid/app/Notification$Builder;

    .line 273
    .line 274
    .line 275
    :cond_f
    iget-object p0, p0, La41;->f:Lp71;

    .line 276
    .line 277
    const/16 v1, 0x1c

    .line 278
    .line 279
    if-lt v0, v1, :cond_10

    .line 280
    .line 281
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 282
    .line 283
    .line 284
    invoke-static {p0}, Lx4;->B(Lp71;)Landroid/app/Person;

    .line 285
    .line 286
    .line 287
    move-result-object p0

    .line 288
    invoke-static {p1, p0}, Ly31;->a(Landroid/app/Notification$Builder;Landroid/app/Person;)Landroid/app/Notification$Builder;

    .line 289
    .line 290
    .line 291
    goto :goto_4

    .line 292
    :cond_10
    iget-object p0, p0, Lp71;->c:Ljava/lang/String;

    .line 293
    .line 294
    invoke-virtual {p1, p0}, Landroid/app/Notification$Builder;->addPerson(Ljava/lang/String;)Landroid/app/Notification$Builder;

    .line 295
    .line 296
    .line 297
    :cond_11
    :goto_4
    const-string p0, "call"

    .line 298
    .line 299
    invoke-virtual {p1, p0}, Landroid/app/Notification$Builder;->setCategory(Ljava/lang/String;)Landroid/app/Notification$Builder;

    .line 300
    .line 301
    .line 302
    return-void
.end method

.method public final d()Ljava/lang/String;
    .locals 0

    .line 1
    const-string p0, "androidx.core.app.NotificationCompat$CallStyle"

    .line 2
    .line 3
    return-object p0
.end method

.method public final e(Landroid/os/Bundle;)V
    .locals 3

    .line 1
    invoke-super {p0, p1}, Lo41;->e(Landroid/os/Bundle;)V

    .line 2
    .line 3
    .line 4
    const-string v0, "android.callType"

    .line 5
    .line 6
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->getInt(Ljava/lang/String;)I

    .line 7
    .line 8
    .line 9
    move-result v0

    .line 10
    iput v0, p0, La41;->e:I

    .line 11
    .line 12
    const-string v0, "android.callIsVideo"

    .line 13
    .line 14
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->getBoolean(Ljava/lang/String;)Z

    .line 15
    .line 16
    .line 17
    move-result v0

    .line 18
    iput-boolean v0, p0, La41;->j:Z

    .line 19
    .line 20
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    .line 21
    .line 22
    const/16 v1, 0x1c

    .line 23
    .line 24
    if-lt v0, v1, :cond_0

    .line 25
    .line 26
    const-string v0, "android.callPerson"

    .line 27
    .line 28
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 29
    .line 30
    .line 31
    move-result v1

    .line 32
    if-eqz v1, :cond_0

    .line 33
    .line 34
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getParcelable(Ljava/lang/String;)Landroid/os/Parcelable;

    .line 35
    .line 36
    .line 37
    move-result-object v0

    .line 38
    check-cast v0, Landroid/app/Person;

    .line 39
    .line 40
    invoke-static {v0}, Lx4;->g(Landroid/app/Person;)Lp71;

    .line 41
    .line 42
    .line 43
    move-result-object v0

    .line 44
    iput-object v0, p0, La41;->f:Lp71;

    .line 45
    .line 46
    goto :goto_0

    .line 47
    :cond_0
    const-string v0, "android.callPersonCompat"

    .line 48
    .line 49
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 50
    .line 51
    .line 52
    move-result v1

    .line 53
    if-eqz v1, :cond_1

    .line 54
    .line 55
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getBundle(Ljava/lang/String;)Landroid/os/Bundle;

    .line 56
    .line 57
    .line 58
    move-result-object v0

    .line 59
    invoke-static {v0}, Lp71;->a(Landroid/os/Bundle;)Lp71;

    .line 60
    .line 61
    .line 62
    move-result-object v0

    .line 63
    iput-object v0, p0, La41;->f:Lp71;

    .line 64
    .line 65
    :cond_1
    :goto_0
    const-string v0, "android.verificationIcon"

    .line 66
    .line 67
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 68
    .line 69
    .line 70
    move-result v1

    .line 71
    if-eqz v1, :cond_2

    .line 72
    .line 73
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getParcelable(Ljava/lang/String;)Landroid/os/Parcelable;

    .line 74
    .line 75
    .line 76
    move-result-object v0

    .line 77
    check-cast v0, Landroid/graphics/drawable/Icon;

    .line 78
    .line 79
    invoke-static {v0}, Landroidx/core/graphics/drawable/IconCompat;->b(Landroid/graphics/drawable/Icon;)Landroidx/core/graphics/drawable/IconCompat;

    .line 80
    .line 81
    .line 82
    move-result-object v0

    .line 83
    iput-object v0, p0, La41;->m:Landroidx/core/graphics/drawable/IconCompat;

    .line 84
    .line 85
    goto :goto_1

    .line 86
    :cond_2
    const-string v0, "android.verificationIconCompat"

    .line 87
    .line 88
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 89
    .line 90
    .line 91
    move-result v1

    .line 92
    if-eqz v1, :cond_3

    .line 93
    .line 94
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getBundle(Ljava/lang/String;)Landroid/os/Bundle;

    .line 95
    .line 96
    .line 97
    move-result-object v0

    .line 98
    invoke-static {v0}, Landroidx/core/graphics/drawable/IconCompat;->a(Landroid/os/Bundle;)Landroidx/core/graphics/drawable/IconCompat;

    .line 99
    .line 100
    .line 101
    move-result-object v0

    .line 102
    iput-object v0, p0, La41;->m:Landroidx/core/graphics/drawable/IconCompat;

    .line 103
    .line 104
    :cond_3
    :goto_1
    const-string v0, "android.verificationText"

    .line 105
    .line 106
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getCharSequence(Ljava/lang/String;)Ljava/lang/CharSequence;

    .line 107
    .line 108
    .line 109
    move-result-object v0

    .line 110
    iput-object v0, p0, La41;->n:Ljava/lang/CharSequence;

    .line 111
    .line 112
    const-string v0, "android.answerIntent"

    .line 113
    .line 114
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getParcelable(Ljava/lang/String;)Landroid/os/Parcelable;

    .line 115
    .line 116
    .line 117
    move-result-object v0

    .line 118
    check-cast v0, Landroid/app/PendingIntent;

    .line 119
    .line 120
    iput-object v0, p0, La41;->g:Landroid/app/PendingIntent;

    .line 121
    .line 122
    const-string v0, "android.declineIntent"

    .line 123
    .line 124
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getParcelable(Ljava/lang/String;)Landroid/os/Parcelable;

    .line 125
    .line 126
    .line 127
    move-result-object v0

    .line 128
    check-cast v0, Landroid/app/PendingIntent;

    .line 129
    .line 130
    iput-object v0, p0, La41;->h:Landroid/app/PendingIntent;

    .line 131
    .line 132
    const-string v0, "android.hangUpIntent"

    .line 133
    .line 134
    invoke-virtual {p1, v0}, Landroid/os/Bundle;->getParcelable(Ljava/lang/String;)Landroid/os/Parcelable;

    .line 135
    .line 136
    .line 137
    move-result-object v0

    .line 138
    check-cast v0, Landroid/app/PendingIntent;

    .line 139
    .line 140
    iput-object v0, p0, La41;->i:Landroid/app/PendingIntent;

    .line 141
    .line 142
    const-string v0, "android.answerColor"

    .line 143
    .line 144
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 145
    .line 146
    .line 147
    move-result v1

    .line 148
    const/4 v2, 0x0

    .line 149
    if-eqz v1, :cond_4

    .line 150
    .line 151
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->getInt(Ljava/lang/String;)I

    .line 152
    .line 153
    .line 154
    move-result v0

    .line 155
    invoke-static {v0}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 156
    .line 157
    .line 158
    move-result-object v0

    .line 159
    goto :goto_2

    .line 160
    :cond_4
    move-object v0, v2

    .line 161
    :goto_2
    iput-object v0, p0, La41;->k:Ljava/lang/Integer;

    .line 162
    .line 163
    const-string v0, "android.declineColor"

    .line 164
    .line 165
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 166
    .line 167
    .line 168
    move-result v1

    .line 169
    if-eqz v1, :cond_5

    .line 170
    .line 171
    invoke-virtual {p1, v0}, Landroid/os/BaseBundle;->getInt(Ljava/lang/String;)I

    .line 172
    .line 173
    .line 174
    move-result p1

    .line 175
    invoke-static {p1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 176
    .line 177
    .line 178
    move-result-object v2

    .line 179
    :cond_5
    iput-object v2, p0, La41;->l:Ljava/lang/Integer;

    .line 180
    .line 181
    return-void
.end method

.method public final f(IILjava/lang/Integer;ILandroid/app/PendingIntent;)Lt31;
    .locals 2

    .line 1
    if-nez p3, :cond_0

    .line 2
    .line 3
    iget-object p3, p0, Lo41;->a:Lx31;

    .line 4
    .line 5
    iget-object p3, p3, Lx31;->a:Landroid/content/Context;

    .line 6
    .line 7
    invoke-virtual {p3, p4}, Landroid/content/Context;->getColor(I)I

    .line 8
    .line 9
    .line 10
    move-result p3

    .line 11
    invoke-static {p3}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 12
    .line 13
    .line 14
    move-result-object p3

    .line 15
    :cond_0
    new-instance p4, Landroid/text/SpannableStringBuilder;

    .line 16
    .line 17
    invoke-direct {p4}, Landroid/text/SpannableStringBuilder;-><init>()V

    .line 18
    .line 19
    .line 20
    iget-object v0, p0, Lo41;->a:Lx31;

    .line 21
    .line 22
    iget-object v0, v0, Lx31;->a:Landroid/content/Context;

    .line 23
    .line 24
    invoke-virtual {v0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 25
    .line 26
    .line 27
    move-result-object v0

    .line 28
    invoke-virtual {v0, p2}, Landroid/content/res/Resources;->getString(I)Ljava/lang/String;

    .line 29
    .line 30
    .line 31
    move-result-object p2

    .line 32
    invoke-virtual {p4, p2}, Landroid/text/SpannableStringBuilder;->append(Ljava/lang/CharSequence;)Landroid/text/SpannableStringBuilder;

    .line 33
    .line 34
    .line 35
    new-instance p2, Landroid/text/style/ForegroundColorSpan;

    .line 36
    .line 37
    invoke-virtual {p3}, Ljava/lang/Integer;->intValue()I

    .line 38
    .line 39
    .line 40
    move-result p3

    .line 41
    invoke-direct {p2, p3}, Landroid/text/style/ForegroundColorSpan;-><init>(I)V

    .line 42
    .line 43
    .line 44
    invoke-virtual {p4}, Landroid/text/SpannableStringBuilder;->length()I

    .line 45
    .line 46
    .line 47
    move-result p3

    .line 48
    const/16 v0, 0x12

    .line 49
    .line 50
    const/4 v1, 0x0

    .line 51
    invoke-virtual {p4, p2, v1, p3, v0}, Landroid/text/SpannableStringBuilder;->setSpan(Ljava/lang/Object;III)V

    .line 52
    .line 53
    .line 54
    new-instance p2, Ls31;

    .line 55
    .line 56
    iget-object p0, p0, Lo41;->a:Lx31;

    .line 57
    .line 58
    iget-object p0, p0, Lx31;->a:Landroid/content/Context;

    .line 59
    .line 60
    sget-object p3, Landroidx/core/graphics/drawable/IconCompat;->k:Landroid/graphics/PorterDuff$Mode;

    .line 61
    .line 62
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 63
    .line 64
    .line 65
    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 66
    .line 67
    .line 68
    move-result-object p3

    .line 69
    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    .line 70
    .line 71
    .line 72
    move-result-object p0

    .line 73
    invoke-static {p3, p0, p1}, Landroidx/core/graphics/drawable/IconCompat;->e(Landroid/content/res/Resources;Ljava/lang/String;I)Landroidx/core/graphics/drawable/IconCompat;

    .line 74
    .line 75
    .line 76
    move-result-object p0

    .line 77
    invoke-direct {p2, p0, p4, p5}, Ls31;-><init>(Landroidx/core/graphics/drawable/IconCompat;Ljava/lang/CharSequence;Landroid/app/PendingIntent;)V

    .line 78
    .line 79
    .line 80
    invoke-virtual {p2}, Ls31;->a()Lt31;

    .line 81
    .line 82
    .line 83
    move-result-object p0

    .line 84
    iget-object p1, p0, Lt31;->a:Landroid/os/Bundle;

    .line 85
    .line 86
    const-string p2, "key_action_priority"

    .line 87
    .line 88
    const/4 p3, 0x1

    .line 89
    invoke-virtual {p1, p2, p3}, Landroid/os/BaseBundle;->putBoolean(Ljava/lang/String;Z)V

    .line 90
    .line 91
    .line 92
    return-object p0
.end method
