.class public final synthetic La4;
.super Ljava/lang/Object;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"

# interfaces
.implements Liw;
.implements Lrd;
.implements Lz41;
.implements Lpk;
.implements Lcom/google/android/gms/tasks/Continuation;
.implements Lyz;
.implements Lqd;


# instance fields
.field public final synthetic a:I

.field public final synthetic b:Ljava/lang/Object;


# direct methods
.method public synthetic constructor <init>(Ljava/lang/Object;I)V
    .locals 0

    .line 1
    iput p2, p0, La4;->a:I

    .line 2
    .line 3
    iput-object p1, p0, La4;->b:Ljava/lang/Object;

    .line 4
    .line 5
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 6
    .line 7
    .line 8
    return-void
.end method


# virtual methods
.method public a()Ljava/io/InputStream;
    .locals 1

    .line 1
    iget-object p0, p0, La4;->b:Ljava/lang/Object;

    .line 2
    .line 3
    check-cast p0, Ljava/io/File;

    .line 4
    .line 5
    new-instance v0, Ljava/io/FileInputStream;

    .line 6
    .line 7
    invoke-direct {v0, p0}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    .line 8
    .line 9
    .line 10
    return-object v0
.end method

.method public b(Ljc1;)V
    .locals 3

    .line 1
    iget v0, p0, La4;->a:I

    .line 2
    .line 3
    iget-object p0, p0, La4;->b:Ljava/lang/Object;

    .line 4
    .line 5
    packed-switch v0, :pswitch_data_0

    .line 6
    .line 7
    .line 8
    check-cast p0, Lpp;

    .line 9
    .line 10
    const-string v0, "FirebaseCrashlytics"

    .line 11
    .line 12
    const/4 v1, 0x3

    .line 13
    invoke-static {v0, v1}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 14
    .line 15
    .line 16
    move-result v1

    .line 17
    if-eqz v1, :cond_0

    .line 18
    .line 19
    const-string v1, "Crashlytics native component now available."

    .line 20
    .line 21
    const/4 v2, 0x0

    .line 22
    invoke-static {v0, v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 23
    .line 24
    .line 25
    :cond_0
    iget-object p0, p0, Lpp;->b:Ljava/util/concurrent/atomic/AtomicReference;

    .line 26
    .line 27
    invoke-interface {p1}, Ljc1;->get()Ljava/lang/Object;

    .line 28
    .line 29
    .line 30
    move-result-object p1

    .line 31
    check-cast p1, Lpp;

    .line 32
    .line 33
    invoke-virtual {p0, p1}, Ljava/util/concurrent/atomic/AtomicReference;->set(Ljava/lang/Object;)V

    .line 34
    .line 35
    .line 36
    return-void

    .line 37
    :pswitch_0
    check-cast p0, Lop5;

    .line 38
    .line 39
    iget-object p0, p0, Lop5;->c:Ljava/lang/Object;

    .line 40
    .line 41
    check-cast p0, Ljava/util/concurrent/atomic/AtomicReference;

    .line 42
    .line 43
    invoke-interface {p1}, Ljc1;->get()Ljava/lang/Object;

    .line 44
    .line 45
    .line 46
    move-result-object p1

    .line 47
    check-cast p1, Lpp0;

    .line 48
    .line 49
    invoke-virtual {p0, p1}, Ljava/util/concurrent/atomic/AtomicReference;->set(Ljava/lang/Object;)V

    .line 50
    .line 51
    .line 52
    return-void

    .line 53
    :pswitch_1
    check-cast p0, Ljb4;

    .line 54
    .line 55
    iget-object p0, p0, Ljb4;->c:Ljava/lang/Object;

    .line 56
    .line 57
    check-cast p0, Ljava/util/concurrent/atomic/AtomicReference;

    .line 58
    .line 59
    invoke-interface {p1}, Ljc1;->get()Ljava/lang/Object;

    .line 60
    .line 61
    .line 62
    move-result-object p1

    .line 63
    check-cast p1, Lzp0;

    .line 64
    .line 65
    invoke-virtual {p0, p1}, Ljava/util/concurrent/atomic/AtomicReference;->set(Ljava/lang/Object;)V

    .line 66
    .line 67
    .line 68
    return-void

    .line 69
    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method public c()Ljava/lang/Object;
    .locals 5

    .line 1
    iget v0, p0, La4;->a:I

    .line 2
    .line 3
    iget-object p0, p0, La4;->b:Ljava/lang/Object;

    .line 4
    .line 5
    packed-switch v0, :pswitch_data_0

    .line 6
    .line 7
    .line 8
    check-cast p0, Ljava/lang/Class;

    .line 9
    .line 10
    :try_start_0
    sget-object v0, Lh12;->a:Lh12;

    .line 11
    .line 12
    invoke-virtual {v0, p0}, Lh12;->a(Ljava/lang/Class;)Ljava/lang/Object;

    .line 13
    .line 14
    .line 15
    move-result-object p0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 16
    return-object p0

    .line 17
    :catch_0
    move-exception v0

    .line 18
    new-instance v1, Ljava/lang/RuntimeException;

    .line 19
    .line 20
    new-instance v2, Ljava/lang/StringBuilder;

    .line 21
    .line 22
    const-string v3, "Unable to create instance of "

    .line 23
    .line 24
    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 25
    .line 26
    .line 27
    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    .line 28
    .line 29
    .line 30
    const-string p0, ". Registering an InstanceCreator or a TypeAdapter for this type, or adding a no-args constructor may fix this problem."

    .line 31
    .line 32
    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 33
    .line 34
    .line 35
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 36
    .line 37
    .line 38
    move-result-object p0

    .line 39
    invoke-direct {v1, p0, v0}, Ljava/lang/RuntimeException;-><init>(Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 40
    .line 41
    .line 42
    throw v1

    .line 43
    :pswitch_0
    check-cast p0, Ljava/lang/reflect/Constructor;

    .line 44
    .line 45
    const-string v0, "\' with no args"

    .line 46
    .line 47
    const-string v1, "Failed to invoke constructor \'"

    .line 48
    .line 49
    const/4 v2, 0x0

    .line 50
    :try_start_1
    invoke-virtual {p0, v2}, Ljava/lang/reflect/Constructor;->newInstance([Ljava/lang/Object;)Ljava/lang/Object;

    .line 51
    .line 52
    .line 53
    move-result-object v2
    :try_end_1
    .catch Ljava/lang/InstantiationException; {:try_start_1 .. :try_end_1} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_1 .. :try_end_1} :catch_2
    .catch Ljava/lang/IllegalAccessException; {:try_start_1 .. :try_end_1} :catch_1

    .line 54
    goto :goto_0

    .line 55
    :catch_1
    move-exception p0

    .line 56
    sget-object v0, Lpe1;->a:Ld93;

    .line 57
    .line 58
    const-string v0, "Unexpected IllegalAccessException occurred (Gson 2.12.0). Certain ReflectionAccessFilter features require Java >= 9 to work correctly. If you are not using ReflectionAccessFilter, report this to the Gson maintainers."

    .line 59
    .line 60
    invoke-static {v0, p0}, Lm81;->j(Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 61
    .line 62
    .line 63
    goto :goto_0

    .line 64
    :catch_2
    move-exception v3

    .line 65
    new-instance v4, Ljava/lang/StringBuilder;

    .line 66
    .line 67
    invoke-direct {v4, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 68
    .line 69
    .line 70
    invoke-static {p0}, Lpe1;->b(Ljava/lang/reflect/Constructor;)Ljava/lang/String;

    .line 71
    .line 72
    .line 73
    move-result-object p0

    .line 74
    invoke-virtual {v4, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 75
    .line 76
    .line 77
    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 78
    .line 79
    .line 80
    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 81
    .line 82
    .line 83
    move-result-object p0

    .line 84
    invoke-virtual {v3}, Ljava/lang/reflect/InvocationTargetException;->getCause()Ljava/lang/Throwable;

    .line 85
    .line 86
    .line 87
    move-result-object v0

    .line 88
    invoke-static {p0, v0}, Lm81;->j(Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 89
    .line 90
    .line 91
    :goto_0
    return-object v2

    .line 92
    :catch_3
    move-exception v2

    .line 93
    new-instance v3, Ljava/lang/RuntimeException;

    .line 94
    .line 95
    invoke-static {p0}, Lpe1;->b(Ljava/lang/reflect/Constructor;)Ljava/lang/String;

    .line 96
    .line 97
    .line 98
    move-result-object p0

    .line 99
    new-instance v4, Ljava/lang/StringBuilder;

    .line 100
    .line 101
    invoke-direct {v4, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 102
    .line 103
    .line 104
    invoke-virtual {v4, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 105
    .line 106
    .line 107
    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 108
    .line 109
    .line 110
    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 111
    .line 112
    .line 113
    move-result-object p0

    .line 114
    invoke-direct {v3, p0, v2}, Ljava/lang/RuntimeException;-><init>(Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 115
    .line 116
    .line 117
    throw v3

    .line 118
    nop

    .line 119
    :pswitch_data_0
    .packed-switch 0x4
        :pswitch_0
    .end packed-switch
.end method

.method public d(Lzc2;)Llg;
    .locals 18

    .line 1
    move-object/from16 v0, p0

    .line 2
    .line 3
    move-object/from16 v1, p1

    .line 4
    .line 5
    iget-object v0, v0, La4;->b:Ljava/lang/Object;

    .line 6
    .line 7
    check-cast v0, Lmg;

    .line 8
    .line 9
    iget-object v2, v1, Lzc2;->b:Ljava/lang/Object;

    .line 10
    .line 11
    check-cast v2, Ljava/net/URL;

    .line 12
    .line 13
    const-string v3, "CctTransportBackend"

    .line 14
    .line 15
    invoke-static {v3}, Lht3;->h(Ljava/lang/String;)Ljava/lang/String;

    .line 16
    .line 17
    .line 18
    move-result-object v4

    .line 19
    const/4 v5, 0x4

    .line 20
    invoke-static {v4, v5}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 21
    .line 22
    .line 23
    move-result v6

    .line 24
    if-eqz v6, :cond_0

    .line 25
    .line 26
    filled-new-array {v2}, [Ljava/lang/Object;

    .line 27
    .line 28
    .line 29
    move-result-object v6

    .line 30
    const-string v7, "Making request to: %s"

    .line 31
    .line 32
    invoke-static {v7, v6}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 33
    .line 34
    .line 35
    move-result-object v6

    .line 36
    invoke-static {v4, v6}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 37
    .line 38
    .line 39
    :cond_0
    invoke-virtual {v2}, Ljava/net/URL;->openConnection()Ljava/net/URLConnection;

    .line 40
    .line 41
    .line 42
    move-result-object v2

    .line 43
    check-cast v2, Ljava/net/HttpURLConnection;

    .line 44
    .line 45
    const/16 v4, 0x7530

    .line 46
    .line 47
    invoke-virtual {v2, v4}, Ljava/net/URLConnection;->setConnectTimeout(I)V

    .line 48
    .line 49
    .line 50
    iget v4, v0, Lmg;->g:I

    .line 51
    .line 52
    invoke-virtual {v2, v4}, Ljava/net/URLConnection;->setReadTimeout(I)V

    .line 53
    .line 54
    .line 55
    const/4 v4, 0x1

    .line 56
    invoke-virtual {v2, v4}, Ljava/net/URLConnection;->setDoOutput(Z)V

    .line 57
    .line 58
    .line 59
    const/4 v4, 0x0

    .line 60
    invoke-virtual {v2, v4}, Ljava/net/HttpURLConnection;->setInstanceFollowRedirects(Z)V

    .line 61
    .line 62
    .line 63
    const-string v4, "POST"

    .line 64
    .line 65
    invoke-virtual {v2, v4}, Ljava/net/HttpURLConnection;->setRequestMethod(Ljava/lang/String;)V

    .line 66
    .line 67
    .line 68
    const-string v4, "User-Agent"

    .line 69
    .line 70
    const-string v6, "datatransport/3.3.0 android/"

    .line 71
    .line 72
    invoke-virtual {v2, v4, v6}, Ljava/net/URLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 73
    .line 74
    .line 75
    const-string v4, "Content-Encoding"

    .line 76
    .line 77
    const-string v6, "gzip"

    .line 78
    .line 79
    invoke-virtual {v2, v4, v6}, Ljava/net/URLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 80
    .line 81
    .line 82
    const-string v7, "application/json"

    .line 83
    .line 84
    const-string v8, "Content-Type"

    .line 85
    .line 86
    invoke-virtual {v2, v8, v7}, Ljava/net/URLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 87
    .line 88
    .line 89
    const-string v7, "Accept-Encoding"

    .line 90
    .line 91
    invoke-virtual {v2, v7, v6}, Ljava/net/URLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 92
    .line 93
    .line 94
    iget-object v7, v1, Lzc2;->d:Ljava/lang/Object;

    .line 95
    .line 96
    check-cast v7, Ljava/lang/String;

    .line 97
    .line 98
    if-eqz v7, :cond_1

    .line 99
    .line 100
    const-string v9, "X-Goog-Api-Key"

    .line 101
    .line 102
    invoke-virtual {v2, v9, v7}, Ljava/net/URLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 103
    .line 104
    .line 105
    :cond_1
    :try_start_0
    invoke-virtual {v2}, Ljava/net/URLConnection;->getOutputStream()Ljava/io/OutputStream;

    .line 106
    .line 107
    .line 108
    move-result-object v10
    :try_end_0
    .catch Ljava/net/ConnectException; {:try_start_0 .. :try_end_0} :catch_3
    .catch Ljava/net/UnknownHostException; {:try_start_0 .. :try_end_0} :catch_2
    .catch Ln00; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    .line 109
    :try_start_1
    new-instance v11, Ljava/util/zip/GZIPOutputStream;

    .line 110
    .line 111
    invoke-direct {v11, v10}, Ljava/util/zip/GZIPOutputStream;-><init>(Ljava/io/OutputStream;)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_4

    .line 112
    .line 113
    .line 114
    :try_start_2
    iget-object v0, v0, Lmg;->a:Lh55;

    .line 115
    .line 116
    iget-object v1, v1, Lzc2;->c:Ljava/lang/Object;

    .line 117
    .line 118
    check-cast v1, Lm9;

    .line 119
    .line 120
    new-instance v13, Ljava/io/BufferedWriter;

    .line 121
    .line 122
    new-instance v12, Ljava/io/OutputStreamWriter;

    .line 123
    .line 124
    invoke-direct {v12, v11}, Ljava/io/OutputStreamWriter;-><init>(Ljava/io/OutputStream;)V

    .line 125
    .line 126
    .line 127
    invoke-direct {v13, v12}, Ljava/io/BufferedWriter;-><init>(Ljava/io/Writer;)V

    .line 128
    .line 129
    .line 130
    new-instance v12, Lct0;

    .line 131
    .line 132
    iget-object v0, v0, Lh55;->b:Ljava/lang/Object;

    .line 133
    .line 134
    check-cast v0, Lis0;

    .line 135
    .line 136
    iget-object v14, v0, Lis0;->a:Ljava/util/HashMap;

    .line 137
    .line 138
    iget-object v7, v0, Lis0;->b:Ljava/util/HashMap;

    .line 139
    .line 140
    iget-object v9, v0, Lis0;->c:Lfs0;

    .line 141
    .line 142
    iget-boolean v0, v0, Lis0;->d:Z

    .line 143
    .line 144
    move/from16 v17, v0

    .line 145
    .line 146
    move-object v15, v7

    .line 147
    move-object/from16 v16, v9

    .line 148
    .line 149
    invoke-direct/range {v12 .. v17}, Lct0;-><init>(Ljava/io/Writer;Ljava/util/HashMap;Ljava/util/HashMap;Lfs0;Z)V

    .line 150
    .line 151
    .line 152
    invoke-virtual {v12, v1}, Lct0;->h(Ljava/lang/Object;)Lct0;

    .line 153
    .line 154
    .line 155
    invoke-virtual {v12}, Lct0;->j()V

    .line 156
    .line 157
    .line 158
    iget-object v0, v12, Lct0;->b:Landroid/util/JsonWriter;

    .line 159
    .line 160
    invoke-virtual {v0}, Landroid/util/JsonWriter;->flush()V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_5

    .line 161
    .line 162
    .line 163
    :try_start_3
    invoke-virtual {v11}, Ljava/io/OutputStream;->close()V
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_4

    .line 164
    .line 165
    .line 166
    if-eqz v10, :cond_2

    .line 167
    .line 168
    :try_start_4
    invoke-virtual {v10}, Ljava/io/OutputStream;->close()V
    :try_end_4
    .catch Ljava/net/ConnectException; {:try_start_4 .. :try_end_4} :catch_3
    .catch Ljava/net/UnknownHostException; {:try_start_4 .. :try_end_4} :catch_2
    .catch Ln00; {:try_start_4 .. :try_end_4} :catch_1
    .catch Ljava/io/IOException; {:try_start_4 .. :try_end_4} :catch_0

    .line 169
    .line 170
    .line 171
    goto :goto_1

    .line 172
    :catch_0
    move-exception v0

    .line 173
    goto/16 :goto_d

    .line 174
    .line 175
    :catch_1
    move-exception v0

    .line 176
    goto/16 :goto_d

    .line 177
    .line 178
    :catch_2
    move-exception v0

    .line 179
    :goto_0
    const-wide/16 v4, 0x0

    .line 180
    .line 181
    const/4 v6, 0x0

    .line 182
    goto/16 :goto_e

    .line 183
    .line 184
    :catch_3
    move-exception v0

    .line 185
    goto :goto_0

    .line 186
    :cond_2
    :goto_1
    invoke-virtual {v2}, Ljava/net/HttpURLConnection;->getResponseCode()I

    .line 187
    .line 188
    .line 189
    move-result v0

    .line 190
    invoke-static {v0}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 191
    .line 192
    .line 193
    move-result-object v1

    .line 194
    invoke-static {v3}, Lht3;->h(Ljava/lang/String;)Ljava/lang/String;

    .line 195
    .line 196
    .line 197
    move-result-object v7

    .line 198
    invoke-static {v7, v5}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 199
    .line 200
    .line 201
    move-result v5

    .line 202
    if-eqz v5, :cond_3

    .line 203
    .line 204
    filled-new-array {v1}, [Ljava/lang/Object;

    .line 205
    .line 206
    .line 207
    move-result-object v1

    .line 208
    const-string v5, "Status Code: %d"

    .line 209
    .line 210
    invoke-static {v5, v1}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 211
    .line 212
    .line 213
    move-result-object v1

    .line 214
    invoke-static {v7, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 215
    .line 216
    .line 217
    :cond_3
    const-string v1, "Content-Type: %s"

    .line 218
    .line 219
    invoke-virtual {v2, v8}, Ljava/net/URLConnection;->getHeaderField(Ljava/lang/String;)Ljava/lang/String;

    .line 220
    .line 221
    .line 222
    move-result-object v5

    .line 223
    invoke-static {v3, v1, v5}, Lht3;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Object;)V

    .line 224
    .line 225
    .line 226
    const-string v1, "Content-Encoding: %s"

    .line 227
    .line 228
    invoke-virtual {v2, v4}, Ljava/net/URLConnection;->getHeaderField(Ljava/lang/String;)Ljava/lang/String;

    .line 229
    .line 230
    .line 231
    move-result-object v5

    .line 232
    invoke-static {v3, v1, v5}, Lht3;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Object;)V

    .line 233
    .line 234
    .line 235
    const/16 v1, 0x12e

    .line 236
    .line 237
    if-eq v0, v1, :cond_b

    .line 238
    .line 239
    const/16 v1, 0x12d

    .line 240
    .line 241
    if-eq v0, v1, :cond_b

    .line 242
    .line 243
    const/16 v1, 0x133

    .line 244
    .line 245
    if-ne v0, v1, :cond_4

    .line 246
    .line 247
    goto :goto_7

    .line 248
    :cond_4
    const/16 v1, 0xc8

    .line 249
    .line 250
    if-eq v0, v1, :cond_5

    .line 251
    .line 252
    new-instance v1, Llg;

    .line 253
    .line 254
    const-wide/16 v2, 0x0

    .line 255
    .line 256
    const/4 v4, 0x0

    .line 257
    invoke-direct {v1, v0, v4, v2, v3}, Llg;-><init>(ILjava/net/URL;J)V

    .line 258
    .line 259
    .line 260
    return-object v1

    .line 261
    :cond_5
    invoke-virtual {v2}, Ljava/net/URLConnection;->getInputStream()Ljava/io/InputStream;

    .line 262
    .line 263
    .line 264
    move-result-object v1

    .line 265
    :try_start_5
    invoke-virtual {v2, v4}, Ljava/net/URLConnection;->getHeaderField(Ljava/lang/String;)Ljava/lang/String;

    .line 266
    .line 267
    .line 268
    move-result-object v2

    .line 269
    invoke-virtual {v6, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 270
    .line 271
    .line 272
    move-result v2

    .line 273
    if-eqz v2, :cond_6

    .line 274
    .line 275
    new-instance v2, Ljava/util/zip/GZIPInputStream;

    .line 276
    .line 277
    invoke-direct {v2, v1}, Ljava/util/zip/GZIPInputStream;-><init>(Ljava/io/InputStream;)V
    :try_end_5
    .catchall {:try_start_5 .. :try_end_5} :catchall_0

    .line 278
    .line 279
    .line 280
    goto :goto_2

    .line 281
    :cond_6
    move-object v2, v1

    .line 282
    :goto_2
    :try_start_6
    new-instance v3, Ljava/io/BufferedReader;

    .line 283
    .line 284
    new-instance v4, Ljava/io/InputStreamReader;

    .line 285
    .line 286
    invoke-direct {v4, v2}, Ljava/io/InputStreamReader;-><init>(Ljava/io/InputStream;)V

    .line 287
    .line 288
    .line 289
    invoke-direct {v3, v4}, Ljava/io/BufferedReader;-><init>(Ljava/io/Reader;)V

    .line 290
    .line 291
    .line 292
    invoke-static {v3}, Lsb;->a(Ljava/io/BufferedReader;)Lsb;

    .line 293
    .line 294
    .line 295
    move-result-object v3

    .line 296
    iget-wide v3, v3, Lsb;->a:J

    .line 297
    .line 298
    new-instance v5, Llg;

    .line 299
    .line 300
    const/4 v6, 0x0

    .line 301
    invoke-direct {v5, v0, v6, v3, v4}, Llg;-><init>(ILjava/net/URL;J)V
    :try_end_6
    .catchall {:try_start_6 .. :try_end_6} :catchall_1

    .line 302
    .line 303
    .line 304
    if-eqz v2, :cond_7

    .line 305
    .line 306
    :try_start_7
    invoke-virtual {v2}, Ljava/io/InputStream;->close()V
    :try_end_7
    .catchall {:try_start_7 .. :try_end_7} :catchall_0

    .line 307
    .line 308
    .line 309
    goto :goto_3

    .line 310
    :catchall_0
    move-exception v0

    .line 311
    move-object v2, v0

    .line 312
    goto :goto_5

    .line 313
    :cond_7
    :goto_3
    if-eqz v1, :cond_8

    .line 314
    .line 315
    invoke-virtual {v1}, Ljava/io/InputStream;->close()V

    .line 316
    .line 317
    .line 318
    :cond_8
    return-object v5

    .line 319
    :catchall_1
    move-exception v0

    .line 320
    move-object v3, v0

    .line 321
    if-eqz v2, :cond_9

    .line 322
    .line 323
    :try_start_8
    invoke-virtual {v2}, Ljava/io/InputStream;->close()V
    :try_end_8
    .catchall {:try_start_8 .. :try_end_8} :catchall_2

    .line 324
    .line 325
    .line 326
    goto :goto_4

    .line 327
    :catchall_2
    move-exception v0

    .line 328
    :try_start_9
    invoke-virtual {v3, v0}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    .line 329
    .line 330
    .line 331
    :cond_9
    :goto_4
    throw v3
    :try_end_9
    .catchall {:try_start_9 .. :try_end_9} :catchall_0

    .line 332
    :goto_5
    if-eqz v1, :cond_a

    .line 333
    .line 334
    :try_start_a
    invoke-virtual {v1}, Ljava/io/InputStream;->close()V
    :try_end_a
    .catchall {:try_start_a .. :try_end_a} :catchall_3

    .line 335
    .line 336
    .line 337
    goto :goto_6

    .line 338
    :catchall_3
    move-exception v0

    .line 339
    invoke-virtual {v2, v0}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    .line 340
    .line 341
    .line 342
    :cond_a
    :goto_6
    throw v2

    .line 343
    :cond_b
    :goto_7
    const-string v1, "Location"

    .line 344
    .line 345
    invoke-virtual {v2, v1}, Ljava/net/URLConnection;->getHeaderField(Ljava/lang/String;)Ljava/lang/String;

    .line 346
    .line 347
    .line 348
    move-result-object v1

    .line 349
    new-instance v2, Llg;

    .line 350
    .line 351
    new-instance v3, Ljava/net/URL;

    .line 352
    .line 353
    invoke-direct {v3, v1}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    .line 354
    .line 355
    .line 356
    const-wide/16 v4, 0x0

    .line 357
    .line 358
    invoke-direct {v2, v0, v3, v4, v5}, Llg;-><init>(ILjava/net/URL;J)V

    .line 359
    .line 360
    .line 361
    return-object v2

    .line 362
    :catchall_4
    move-exception v0

    .line 363
    move-object v1, v0

    .line 364
    goto :goto_b

    .line 365
    :goto_8
    move-object v1, v0

    .line 366
    goto :goto_9

    .line 367
    :catchall_5
    move-exception v0

    .line 368
    goto :goto_8

    .line 369
    :goto_9
    :try_start_b
    invoke-virtual {v11}, Ljava/io/OutputStream;->close()V
    :try_end_b
    .catchall {:try_start_b .. :try_end_b} :catchall_6

    .line 370
    .line 371
    .line 372
    goto :goto_a

    .line 373
    :catchall_6
    move-exception v0

    .line 374
    :try_start_c
    invoke-virtual {v1, v0}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    .line 375
    .line 376
    .line 377
    :goto_a
    throw v1
    :try_end_c
    .catchall {:try_start_c .. :try_end_c} :catchall_4

    .line 378
    :goto_b
    if-eqz v10, :cond_c

    .line 379
    .line 380
    :try_start_d
    invoke-virtual {v10}, Ljava/io/OutputStream;->close()V
    :try_end_d
    .catchall {:try_start_d .. :try_end_d} :catchall_7

    .line 381
    .line 382
    .line 383
    goto :goto_c

    .line 384
    :catchall_7
    move-exception v0

    .line 385
    :try_start_e
    invoke-virtual {v1, v0}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    .line 386
    .line 387
    .line 388
    :cond_c
    :goto_c
    throw v1
    :try_end_e
    .catch Ljava/net/ConnectException; {:try_start_e .. :try_end_e} :catch_3
    .catch Ljava/net/UnknownHostException; {:try_start_e .. :try_end_e} :catch_2
    .catch Ln00; {:try_start_e .. :try_end_e} :catch_1
    .catch Ljava/io/IOException; {:try_start_e .. :try_end_e} :catch_0

    .line 389
    :goto_d
    const-string v1, "Couldn\'t encode request, returning with 400"

    .line 390
    .line 391
    invoke-static {v0, v3, v1}, Lht3;->f(Ljava/lang/Exception;Ljava/lang/String;Ljava/lang/String;)V

    .line 392
    .line 393
    .line 394
    new-instance v0, Llg;

    .line 395
    .line 396
    const/16 v1, 0x190

    .line 397
    .line 398
    const-wide/16 v4, 0x0

    .line 399
    .line 400
    const/4 v6, 0x0

    .line 401
    invoke-direct {v0, v1, v6, v4, v5}, Llg;-><init>(ILjava/net/URL;J)V

    .line 402
    .line 403
    .line 404
    goto :goto_f

    .line 405
    :goto_e
    const-string v1, "Couldn\'t open connection, returning with 500"

    .line 406
    .line 407
    invoke-static {v0, v3, v1}, Lht3;->f(Ljava/lang/Exception;Ljava/lang/String;Ljava/lang/String;)V

    .line 408
    .line 409
    .line 410
    new-instance v0, Llg;

    .line 411
    .line 412
    const/16 v1, 0x1f4

    .line 413
    .line 414
    invoke-direct {v0, v1, v6, v4, v5}, Llg;-><init>(ILjava/net/URL;J)V

    .line 415
    .line 416
    .line 417
    :goto_f
    return-object v0
.end method

.method public f(Ljava/lang/Object;Ljb4;)V
    .locals 7

    .line 1
    iget v0, p0, La4;->a:I

    .line 2
    .line 3
    const-string v1, ", Stacktrace: "

    .line 4
    .line 5
    const-string v2, "Cause: "

    .line 6
    .line 7
    const/4 v3, 0x1

    .line 8
    const/4 v4, 0x0

    .line 9
    const/4 v5, 0x0

    .line 10
    iget-object p0, p0, La4;->b:Ljava/lang/Object;

    .line 11
    .line 12
    sparse-switch v0, :sswitch_data_0

    .line 13
    .line 14
    .line 15
    check-cast p0, Lzn;

    .line 16
    .line 17
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 18
    .line 19
    .line 20
    check-cast p1, Ljava/util/List;

    .line 21
    .line 22
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 23
    .line 24
    .line 25
    move-result-object v0

    .line 26
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 27
    .line 28
    .line 29
    check-cast v0, Ljava/lang/Long;

    .line 30
    .line 31
    invoke-virtual {v0}, Ljava/lang/Long;->longValue()J

    .line 32
    .line 33
    .line 34
    move-result-wide v5

    .line 35
    invoke-interface {p1, v3}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 36
    .line 37
    .line 38
    move-result-object p1

    .line 39
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 40
    .line 41
    .line 42
    check-cast p1, Ljava/lang/String;

    .line 43
    .line 44
    :try_start_0
    iget-object v0, p0, Lzn;->a:Ldx0;

    .line 45
    .line 46
    iget-object v0, v0, Ldx0;->d:Ljava/lang/Object;

    .line 47
    .line 48
    check-cast v0, La23;

    .line 49
    .line 50
    new-instance v3, Lwq0;

    .line 51
    .line 52
    invoke-direct {v3, p1, p0}, Lwq0;-><init>(Ljava/lang/String;Lzn;)V

    .line 53
    .line 54
    .line 55
    invoke-virtual {v0, v5, v6, v3}, La23;->e(JLjava/lang/Object;)V

    .line 56
    .line 57
    .line 58
    invoke-static {v4}, Lmj2;->i(Ljava/lang/Object;)Ljava/util/List;

    .line 59
    .line 60
    .line 61
    move-result-object p0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 62
    goto :goto_0

    .line 63
    :catchall_0
    move-exception p0

    .line 64
    instance-of p1, p0, Ln4;

    .line 65
    .line 66
    if-eqz p1, :cond_0

    .line 67
    .line 68
    check-cast p0, Ln4;

    .line 69
    .line 70
    iget-object p1, p0, Ln4;->b:Ljava/lang/String;

    .line 71
    .line 72
    iget-object v0, p0, Ln4;->c:Ljava/lang/Object;

    .line 73
    .line 74
    iget-object p0, p0, Ln4;->a:Ljava/lang/String;

    .line 75
    .line 76
    filled-new-array {p0, p1, v0}, [Ljava/lang/Object;

    .line 77
    .line 78
    .line 79
    move-result-object p0

    .line 80
    invoke-static {p0}, Lti;->A([Ljava/lang/Object;)Ljava/util/List;

    .line 81
    .line 82
    .line 83
    move-result-object p0

    .line 84
    goto :goto_0

    .line 85
    :cond_0
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 86
    .line 87
    .line 88
    move-result-object p1

    .line 89
    invoke-virtual {p1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    .line 90
    .line 91
    .line 92
    move-result-object p1

    .line 93
    invoke-virtual {p0}, Ljava/lang/Throwable;->toString()Ljava/lang/String;

    .line 94
    .line 95
    .line 96
    move-result-object v0

    .line 97
    invoke-virtual {p0}, Ljava/lang/Throwable;->getCause()Ljava/lang/Throwable;

    .line 98
    .line 99
    .line 100
    move-result-object v3

    .line 101
    invoke-static {p0}, Landroid/util/Log;->getStackTraceString(Ljava/lang/Throwable;)Ljava/lang/String;

    .line 102
    .line 103
    .line 104
    move-result-object p0

    .line 105
    invoke-static {v2, v3, v1, p0}, Lc40;->f(Ljava/lang/String;Ljava/lang/Throwable;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 106
    .line 107
    .line 108
    move-result-object p0

    .line 109
    filled-new-array {p1, v0, p0}, [Ljava/lang/String;

    .line 110
    .line 111
    .line 112
    move-result-object p0

    .line 113
    invoke-static {p0}, Lti;->A([Ljava/lang/Object;)Ljava/util/List;

    .line 114
    .line 115
    .line 116
    move-result-object p0

    .line 117
    :goto_0
    invoke-virtual {p2, p0}, Ljb4;->o(Ljava/lang/Object;)V

    .line 118
    .line 119
    .line 120
    return-void

    .line 121
    :sswitch_0
    check-cast p0, Lt42;

    .line 122
    .line 123
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 124
    .line 125
    .line 126
    check-cast p1, Ljava/util/List;

    .line 127
    .line 128
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 129
    .line 130
    .line 131
    move-result-object p1

    .line 132
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 133
    .line 134
    .line 135
    check-cast p1, Ljava/lang/Long;

    .line 136
    .line 137
    invoke-virtual {p1}, Ljava/lang/Long;->longValue()J

    .line 138
    .line 139
    .line 140
    move-result-wide v5

    .line 141
    :try_start_1
    iget-object p1, p0, Lt42;->b:Ljava/lang/Object;

    .line 142
    .line 143
    check-cast p1, Ldx0;

    .line 144
    .line 145
    iget-object p1, p1, Ldx0;->d:Ljava/lang/Object;

    .line 146
    .line 147
    check-cast p1, La23;

    .line 148
    .line 149
    new-instance v0, Lfz;

    .line 150
    .line 151
    invoke-direct {v0, p0}, Lfz;-><init>(Lt42;)V

    .line 152
    .line 153
    .line 154
    invoke-virtual {p1, v5, v6, v0}, La23;->e(JLjava/lang/Object;)V

    .line 155
    .line 156
    .line 157
    invoke-static {v4}, Lmj2;->i(Ljava/lang/Object;)Ljava/util/List;

    .line 158
    .line 159
    .line 160
    move-result-object p0
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    .line 161
    goto :goto_1

    .line 162
    :catchall_1
    move-exception p0

    .line 163
    instance-of p1, p0, Ln4;

    .line 164
    .line 165
    if-eqz p1, :cond_1

    .line 166
    .line 167
    check-cast p0, Ln4;

    .line 168
    .line 169
    iget-object p1, p0, Ln4;->b:Ljava/lang/String;

    .line 170
    .line 171
    iget-object v0, p0, Ln4;->c:Ljava/lang/Object;

    .line 172
    .line 173
    iget-object p0, p0, Ln4;->a:Ljava/lang/String;

    .line 174
    .line 175
    filled-new-array {p0, p1, v0}, [Ljava/lang/Object;

    .line 176
    .line 177
    .line 178
    move-result-object p0

    .line 179
    invoke-static {p0}, Lti;->A([Ljava/lang/Object;)Ljava/util/List;

    .line 180
    .line 181
    .line 182
    move-result-object p0

    .line 183
    goto :goto_1

    .line 184
    :cond_1
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 185
    .line 186
    .line 187
    move-result-object p1

    .line 188
    invoke-virtual {p1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    .line 189
    .line 190
    .line 191
    move-result-object p1

    .line 192
    invoke-virtual {p0}, Ljava/lang/Throwable;->toString()Ljava/lang/String;

    .line 193
    .line 194
    .line 195
    move-result-object v0

    .line 196
    invoke-virtual {p0}, Ljava/lang/Throwable;->getCause()Ljava/lang/Throwable;

    .line 197
    .line 198
    .line 199
    move-result-object v3

    .line 200
    invoke-static {p0}, Landroid/util/Log;->getStackTraceString(Ljava/lang/Throwable;)Ljava/lang/String;

    .line 201
    .line 202
    .line 203
    move-result-object p0

    .line 204
    invoke-static {v2, v3, v1, p0}, Lc40;->f(Ljava/lang/String;Ljava/lang/Throwable;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 205
    .line 206
    .line 207
    move-result-object p0

    .line 208
    filled-new-array {p1, v0, p0}, [Ljava/lang/String;

    .line 209
    .line 210
    .line 211
    move-result-object p0

    .line 212
    invoke-static {p0}, Lti;->A([Ljava/lang/Object;)Ljava/util/List;

    .line 213
    .line 214
    .line 215
    move-result-object p0

    .line 216
    :goto_1
    invoke-virtual {p2, p0}, Ljb4;->o(Ljava/lang/Object;)V

    .line 217
    .line 218
    .line 219
    return-void

    .line 220
    :sswitch_1
    check-cast p0, Lni0;

    .line 221
    .line 222
    new-instance v0, Ljava/util/ArrayList;

    .line 223
    .line 224
    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 225
    .line 226
    .line 227
    check-cast p1, Ljava/util/ArrayList;

    .line 228
    .line 229
    invoke-virtual {p1, v5}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 230
    .line 231
    .line 232
    move-result-object v1

    .line 233
    check-cast v1, Ljava/lang/String;

    .line 234
    .line 235
    invoke-virtual {p1, v3}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 236
    .line 237
    .line 238
    move-result-object v2

    .line 239
    check-cast v2, Lfi0;

    .line 240
    .line 241
    const/4 v3, 0x2

    .line 242
    invoke-virtual {p1, v3}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 243
    .line 244
    .line 245
    move-result-object p1

    .line 246
    check-cast p1, Ljava/lang/String;

    .line 247
    .line 248
    new-instance v3, Lqh0;

    .line 249
    .line 250
    const/4 v5, 0x7

    .line 251
    invoke-direct {v3, v0, p2, v5}, Lqh0;-><init>(Ljava/util/ArrayList;Ljb4;I)V

    .line 252
    .line 253
    .line 254
    check-cast p0, Lgb0;

    .line 255
    .line 256
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 257
    .line 258
    .line 259
    sget-object p0, Lgb0;->c:Ljava/util/HashMap;

    .line 260
    .line 261
    invoke-virtual {p0, v1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    .line 262
    .line 263
    .line 264
    move-result-object p0

    .line 265
    check-cast p0, Lit2;

    .line 266
    .line 267
    if-nez p0, :cond_2

    .line 268
    .line 269
    new-instance p0, Ljava/lang/Exception;

    .line 270
    .line 271
    const-string p1, "Resolver not found"

    .line 272
    .line 273
    invoke-direct {p0, p1}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    .line 274
    .line 275
    .line 276
    invoke-static {p0}, Lgb5;->l(Ljava/lang/Exception;)Luh0;

    .line 277
    .line 278
    .line 279
    move-result-object p0

    .line 280
    invoke-virtual {v3, p0}, Lqh0;->c(Ljava/lang/Exception;)V

    .line 281
    .line 282
    .line 283
    goto/16 :goto_4

    .line 284
    .line 285
    :cond_2
    if-eqz v2, :cond_3

    .line 286
    .line 287
    iget-object p1, v2, Lfi0;->a:Ljava/lang/String;

    .line 288
    .line 289
    iget-object p2, v2, Lfi0;->b:Ljava/lang/String;

    .line 290
    .line 291
    invoke-static {p1, p2}, Lq71;->z(Ljava/lang/String;Ljava/lang/String;)Lq71;

    .line 292
    .line 293
    .line 294
    move-result-object p1

    .line 295
    new-instance p2, Lu71;

    .line 296
    .line 297
    invoke-direct {p2, p1}, Lu71;-><init>(Lq71;)V

    .line 298
    .line 299
    .line 300
    goto :goto_2

    .line 301
    :cond_3
    sget-object p2, Lgb0;->d:Ljava/util/HashMap;

    .line 302
    .line 303
    invoke-virtual {p2, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    .line 304
    .line 305
    .line 306
    move-result-object p1

    .line 307
    move-object p2, p1

    .line 308
    check-cast p2, Ll11;

    .line 309
    .line 310
    :goto_2
    iget-object p1, p0, Lit2;->c:Ljava/lang/String;

    .line 311
    .line 312
    invoke-static {p1}, Lx40;->g(Ljava/lang/String;)Lx40;

    .line 313
    .line 314
    .line 315
    move-result-object p1

    .line 316
    invoke-static {p1}, Lcom/google/firebase/auth/FirebaseAuth;->getInstance(Lx40;)Lcom/google/firebase/auth/FirebaseAuth;

    .line 317
    .line 318
    .line 319
    move-result-object p1

    .line 320
    iget-object v0, p0, Lit2;->b:Lsz2;

    .line 321
    .line 322
    iget-object v1, p0, Lit2;->e:Lmi2;

    .line 323
    .line 324
    iget-object v2, p1, Lcom/google/firebase/auth/FirebaseAuth;->a:Lx40;

    .line 325
    .line 326
    iget-object v5, p1, Lcom/google/firebase/auth/FirebaseAuth;->e:Lop5;

    .line 327
    .line 328
    invoke-static {p2}, Lmb6;->l(Ljava/lang/Object;)V

    .line 329
    .line 330
    .line 331
    invoke-static {v0}, Lmb6;->l(Ljava/lang/Object;)V

    .line 332
    .line 333
    .line 334
    instance-of v6, p2, Lu71;

    .line 335
    .line 336
    if-eqz v6, :cond_5

    .line 337
    .line 338
    check-cast p2, Lu71;

    .line 339
    .line 340
    iget-object v0, v0, Lsz2;->b:Ljava/lang/String;

    .line 341
    .line 342
    invoke-static {v0}, Lmb6;->i(Ljava/lang/String;)V

    .line 343
    .line 344
    .line 345
    new-instance v6, La50;

    .line 346
    .line 347
    invoke-direct {v6, p1}, La50;-><init>(Lcom/google/firebase/auth/FirebaseAuth;)V

    .line 348
    .line 349
    .line 350
    invoke-virtual {v5}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 351
    .line 352
    .line 353
    invoke-static {}, Lao2;->a()V

    .line 354
    .line 355
    .line 356
    new-instance p1, Lzi2;

    .line 357
    .line 358
    invoke-direct {p1, p2, v0, v4}, Lzi2;-><init>(Ll11;Ljava/lang/String;Ljava/lang/String;)V

    .line 359
    .line 360
    .line 361
    invoke-virtual {p1, v2}, Lxm2;->b(Lx40;)V

    .line 362
    .line 363
    .line 364
    iput-object v6, p1, Lxm2;->e:Ljava/lang/Object;

    .line 365
    .line 366
    if-eqz v1, :cond_4

    .line 367
    .line 368
    iput-object v1, p1, Lxm2;->d:Lmi2;

    .line 369
    .line 370
    :cond_4
    invoke-virtual {v5, p1}, Lop5;->z(Lxm2;)Lcom/google/android/gms/tasks/Task;

    .line 371
    .line 372
    .line 373
    move-result-object p1

    .line 374
    goto :goto_3

    .line 375
    :cond_5
    instance-of v4, p2, Lwx1;

    .line 376
    .line 377
    if-eqz v4, :cond_7

    .line 378
    .line 379
    check-cast p2, Lwx1;

    .line 380
    .line 381
    iget-object v0, v0, Lsz2;->b:Ljava/lang/String;

    .line 382
    .line 383
    invoke-static {v0}, Lmb6;->i(Ljava/lang/String;)V

    .line 384
    .line 385
    .line 386
    iget-object v4, p1, Lcom/google/firebase/auth/FirebaseAuth;->k:Ljava/lang/String;

    .line 387
    .line 388
    new-instance v6, La50;

    .line 389
    .line 390
    invoke-direct {v6, p1}, La50;-><init>(Lcom/google/firebase/auth/FirebaseAuth;)V

    .line 391
    .line 392
    .line 393
    invoke-virtual {v5}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 394
    .line 395
    .line 396
    new-instance p1, Lzi2;

    .line 397
    .line 398
    invoke-direct {p1, p2, v0, v4}, Lzi2;-><init>(Ll11;Ljava/lang/String;Ljava/lang/String;)V

    .line 399
    .line 400
    .line 401
    invoke-virtual {p1, v2}, Lxm2;->b(Lx40;)V

    .line 402
    .line 403
    .line 404
    iput-object v6, p1, Lxm2;->e:Ljava/lang/Object;

    .line 405
    .line 406
    if-eqz v1, :cond_6

    .line 407
    .line 408
    iput-object v1, p1, Lxm2;->d:Lmi2;

    .line 409
    .line 410
    :cond_6
    invoke-virtual {v5, p1}, Lop5;->z(Lxm2;)Lcom/google/android/gms/tasks/Task;

    .line 411
    .line 412
    .line 413
    move-result-object p1

    .line 414
    :goto_3
    new-instance p2, Lt42;

    .line 415
    .line 416
    const/16 v0, 0x17

    .line 417
    .line 418
    invoke-direct {p2, p0, v0}, Lt42;-><init>(Ljava/lang/Object;I)V

    .line 419
    .line 420
    .line 421
    invoke-virtual {p1, p2}, Lcom/google/android/gms/tasks/Task;->continueWithTask(Lcom/google/android/gms/tasks/Continuation;)Lcom/google/android/gms/tasks/Task;

    .line 422
    .line 423
    .line 424
    move-result-object p0

    .line 425
    new-instance p1, Lt50;

    .line 426
    .line 427
    const/16 p2, 0x1d

    .line 428
    .line 429
    invoke-direct {p1, v3, p2}, Lt50;-><init>(Ljava/lang/Object;I)V

    .line 430
    .line 431
    .line 432
    invoke-virtual {p0, p1}, Lcom/google/android/gms/tasks/Task;->addOnCompleteListener(Lcom/google/android/gms/tasks/OnCompleteListener;)Lcom/google/android/gms/tasks/Task;

    .line 433
    .line 434
    .line 435
    goto :goto_4

    .line 436
    :cond_7
    const-string p0, "multiFactorAssertion must be either PhoneMultiFactorAssertion or TotpMultiFactorAssertion."

    .line 437
    .line 438
    invoke-static {p0}, La1;->g(Ljava/lang/String;)V

    .line 439
    .line 440
    .line 441
    :goto_4
    return-void

    .line 442
    nop

    .line 443
    :sswitch_data_0
    .sparse-switch
        0xc -> :sswitch_1
        0x16 -> :sswitch_0
    .end sparse-switch
.end method

.method public k(Lkx1;)Ljava/lang/Object;
    .locals 42

    .line 1
    move-object/from16 v0, p0

    .line 2
    .line 3
    move-object/from16 v1, p1

    .line 4
    .line 5
    iget-object v0, v0, La4;->b:Ljava/lang/Object;

    .line 6
    .line 7
    check-cast v0, Lcom/google/firebase/crashlytics/CrashlyticsRegistrar;

    .line 8
    .line 9
    sget v2, Lcom/google/firebase/crashlytics/CrashlyticsRegistrar;->d:I

    .line 10
    .line 11
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    .line 12
    .line 13
    .line 14
    move-result-wide v2

    .line 15
    const-class v4, Lx40;

    .line 16
    .line 17
    invoke-virtual {v1, v4}, Lkx1;->a(Ljava/lang/Class;)Ljava/lang/Object;

    .line 18
    .line 19
    .line 20
    move-result-object v4

    .line 21
    move-object v6, v4

    .line 22
    check-cast v6, Lx40;

    .line 23
    .line 24
    const-class v4, Lb60;

    .line 25
    .line 26
    invoke-virtual {v1, v4}, Lkx1;->a(Ljava/lang/Class;)Ljava/lang/Object;

    .line 27
    .line 28
    .line 29
    move-result-object v4

    .line 30
    check-cast v4, Lb60;

    .line 31
    .line 32
    const-class v5, Lpp;

    .line 33
    .line 34
    invoke-virtual {v1, v5}, Lkx1;->i(Ljava/lang/Class;)Ld61;

    .line 35
    .line 36
    .line 37
    move-result-object v5

    .line 38
    const-class v7, Ls3;

    .line 39
    .line 40
    invoke-virtual {v1, v7}, Lkx1;->i(Ljava/lang/Class;)Ld61;

    .line 41
    .line 42
    .line 43
    move-result-object v7

    .line 44
    const-class v8, Ln60;

    .line 45
    .line 46
    invoke-virtual {v1, v8}, Lkx1;->i(Ljava/lang/Class;)Ld61;

    .line 47
    .line 48
    .line 49
    move-result-object v8

    .line 50
    iget-object v9, v0, Lcom/google/firebase/crashlytics/CrashlyticsRegistrar;->a:Lyc1;

    .line 51
    .line 52
    invoke-virtual {v1, v9}, Lkx1;->h(Lyc1;)Ljava/lang/Object;

    .line 53
    .line 54
    .line 55
    move-result-object v9

    .line 56
    check-cast v9, Ljava/util/concurrent/ExecutorService;

    .line 57
    .line 58
    iget-object v10, v0, Lcom/google/firebase/crashlytics/CrashlyticsRegistrar;->b:Lyc1;

    .line 59
    .line 60
    invoke-virtual {v1, v10}, Lkx1;->h(Lyc1;)Ljava/lang/Object;

    .line 61
    .line 62
    .line 63
    move-result-object v10

    .line 64
    check-cast v10, Ljava/util/concurrent/ExecutorService;

    .line 65
    .line 66
    iget-object v0, v0, Lcom/google/firebase/crashlytics/CrashlyticsRegistrar;->c:Lyc1;

    .line 67
    .line 68
    invoke-virtual {v1, v0}, Lkx1;->h(Lyc1;)Ljava/lang/Object;

    .line 69
    .line 70
    .line 71
    move-result-object v0

    .line 72
    move-object v1, v0

    .line 73
    check-cast v1, Ljava/util/concurrent/ExecutorService;

    .line 74
    .line 75
    const-string v11, ""

    .line 76
    .line 77
    const-string v12, "FirebaseCrashlytics"

    .line 78
    .line 79
    invoke-virtual {v6}, Lx40;->b()V

    .line 80
    .line 81
    .line 82
    iget-object v13, v6, Lx40;->a:Landroid/content/Context;

    .line 83
    .line 84
    invoke-virtual {v13}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    .line 85
    .line 86
    .line 87
    move-result-object v14

    .line 88
    new-instance v0, Ljava/lang/StringBuilder;

    .line 89
    .line 90
    const-string v15, "Initializing Firebase Crashlytics 20.1.0 for "

    .line 91
    .line 92
    invoke-direct {v0, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 93
    .line 94
    .line 95
    invoke-virtual {v0, v14}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 96
    .line 97
    .line 98
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 99
    .line 100
    .line 101
    move-result-object v0

    .line 102
    const/4 v15, 0x0

    .line 103
    invoke-static {v12, v0, v15}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 104
    .line 105
    .line 106
    new-instance v15, Lxa6;

    .line 107
    .line 108
    invoke-direct {v15, v9, v10}, Lxa6;-><init>(Ljava/util/concurrent/ExecutorService;Ljava/util/concurrent/ExecutorService;)V

    .line 109
    .line 110
    .line 111
    move-object v9, v12

    .line 112
    new-instance v12, Li40;

    .line 113
    .line 114
    invoke-direct {v12}, Ljava/lang/Object;-><init>()V

    .line 115
    .line 116
    .line 117
    sget-object v0, Lcb1;->a:Lcb1;

    .line 118
    .line 119
    invoke-virtual {v0, v13}, Lcb1;->b(Landroid/content/Context;)Lgq;

    .line 120
    .line 121
    .line 122
    move-result-object v0

    .line 123
    check-cast v0, Lsa;

    .line 124
    .line 125
    iget-object v0, v0, Lsa;->a:Ljava/lang/String;

    .line 126
    .line 127
    iput-object v0, v12, Li40;->a:Ljava/lang/Object;

    .line 128
    .line 129
    invoke-virtual {v13}, Landroid/content/Context;->getFilesDir()Ljava/io/File;

    .line 130
    .line 131
    .line 132
    move-result-object v10

    .line 133
    iput-object v10, v12, Li40;->b:Ljava/lang/Object;

    .line 134
    .line 135
    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    .line 136
    .line 137
    .line 138
    move-result v16

    .line 139
    if-nez v16, :cond_1

    .line 140
    .line 141
    move-wide/from16 v21, v2

    .line 142
    .line 143
    new-instance v2, Ljava/lang/StringBuilder;

    .line 144
    .line 145
    const-string v3, ".crashlytics.v3"

    .line 146
    .line 147
    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 148
    .line 149
    .line 150
    sget-object v3, Ljava/io/File;->separator:Ljava/lang/String;

    .line 151
    .line 152
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 153
    .line 154
    .line 155
    invoke-virtual {v0}, Ljava/lang/String;->length()I

    .line 156
    .line 157
    .line 158
    move-result v3

    .line 159
    move-object/from16 p1, v9

    .line 160
    .line 161
    const/16 v9, 0x28

    .line 162
    .line 163
    if-le v3, v9, :cond_0

    .line 164
    .line 165
    invoke-static {v0}, Lmj;->C(Ljava/lang/String;)Ljava/lang/String;

    .line 166
    .line 167
    .line 168
    move-result-object v0

    .line 169
    goto :goto_0

    .line 170
    :cond_0
    const-string v3, "[^a-zA-Z0-9.]"

    .line 171
    .line 172
    const-string v9, "_"

    .line 173
    .line 174
    invoke-virtual {v0, v3, v9}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 175
    .line 176
    .line 177
    move-result-object v0

    .line 178
    :goto_0
    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 179
    .line 180
    .line 181
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 182
    .line 183
    .line 184
    move-result-object v0

    .line 185
    goto :goto_1

    .line 186
    :cond_1
    move-wide/from16 v21, v2

    .line 187
    .line 188
    move-object/from16 p1, v9

    .line 189
    .line 190
    const-string v0, ".com.google.firebase.crashlytics.files.v1"

    .line 191
    .line 192
    :goto_1
    new-instance v2, Ljava/io/File;

    .line 193
    .line 194
    invoke-direct {v2, v10, v0}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 195
    .line 196
    .line 197
    invoke-static {v2}, Li40;->c(Ljava/io/File;)V

    .line 198
    .line 199
    .line 200
    iput-object v2, v12, Li40;->c:Ljava/lang/Object;

    .line 201
    .line 202
    new-instance v0, Ljava/io/File;

    .line 203
    .line 204
    const-string v3, "open-sessions"

    .line 205
    .line 206
    invoke-direct {v0, v2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 207
    .line 208
    .line 209
    invoke-static {v0}, Li40;->c(Ljava/io/File;)V

    .line 210
    .line 211
    .line 212
    iput-object v0, v12, Li40;->d:Ljava/lang/Object;

    .line 213
    .line 214
    new-instance v0, Ljava/io/File;

    .line 215
    .line 216
    const-string v3, "reports"

    .line 217
    .line 218
    invoke-direct {v0, v2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 219
    .line 220
    .line 221
    invoke-static {v0}, Li40;->c(Ljava/io/File;)V

    .line 222
    .line 223
    .line 224
    iput-object v0, v12, Li40;->e:Ljava/lang/Object;

    .line 225
    .line 226
    new-instance v0, Ljava/io/File;

    .line 227
    .line 228
    const-string v3, "priority-reports"

    .line 229
    .line 230
    invoke-direct {v0, v2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 231
    .line 232
    .line 233
    invoke-static {v0}, Li40;->c(Ljava/io/File;)V

    .line 234
    .line 235
    .line 236
    iput-object v0, v12, Li40;->f:Ljava/lang/Object;

    .line 237
    .line 238
    new-instance v0, Ljava/io/File;

    .line 239
    .line 240
    const-string v3, "native-reports"

    .line 241
    .line 242
    invoke-direct {v0, v2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 243
    .line 244
    .line 245
    invoke-static {v0}, Li40;->c(Ljava/io/File;)V

    .line 246
    .line 247
    .line 248
    iput-object v0, v12, Li40;->I:Ljava/lang/Object;

    .line 249
    .line 250
    new-instance v9, Ls1;

    .line 251
    .line 252
    invoke-direct {v9}, Ljava/lang/Object;-><init>()V

    .line 253
    .line 254
    .line 255
    new-instance v2, Ljava/lang/Object;

    .line 256
    .line 257
    invoke-direct {v2}, Ljava/lang/Object;-><init>()V

    .line 258
    .line 259
    .line 260
    iput-object v2, v9, Ls1;->e:Ljava/lang/Object;

    .line 261
    .line 262
    new-instance v0, Lcom/google/android/gms/tasks/TaskCompletionSource;

    .line 263
    .line 264
    invoke-direct {v0}, Lcom/google/android/gms/tasks/TaskCompletionSource;-><init>()V

    .line 265
    .line 266
    .line 267
    iput-object v0, v9, Ls1;->f:Ljava/lang/Object;

    .line 268
    .line 269
    const/4 v3, 0x0

    .line 270
    iput-boolean v3, v9, Ls1;->a:Z

    .line 271
    .line 272
    iput-boolean v3, v9, Ls1;->b:Z

    .line 273
    .line 274
    new-instance v0, Lcom/google/android/gms/tasks/TaskCompletionSource;

    .line 275
    .line 276
    invoke-direct {v0}, Lcom/google/android/gms/tasks/TaskCompletionSource;-><init>()V

    .line 277
    .line 278
    .line 279
    iput-object v0, v9, Ls1;->h:Ljava/lang/Object;

    .line 280
    .line 281
    invoke-virtual {v6}, Lx40;->b()V

    .line 282
    .line 283
    .line 284
    iget-object v0, v6, Lx40;->a:Landroid/content/Context;

    .line 285
    .line 286
    iput-object v6, v9, Ls1;->d:Ljava/lang/Object;

    .line 287
    .line 288
    const-string v10, "com.google.firebase.crashlytics"

    .line 289
    .line 290
    invoke-virtual {v0, v10, v3}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    .line 291
    .line 292
    .line 293
    move-result-object v10

    .line 294
    iput-object v10, v9, Ls1;->c:Ljava/lang/Object;

    .line 295
    .line 296
    const-string v3, "firebase_crashlytics_collection_enabled"

    .line 297
    .line 298
    invoke-interface {v10, v3}, Landroid/content/SharedPreferences;->contains(Ljava/lang/String;)Z

    .line 299
    .line 300
    .line 301
    move-result v16

    .line 302
    move-object/from16 v24, v1

    .line 303
    .line 304
    const/4 v1, 0x1

    .line 305
    if-eqz v16, :cond_2

    .line 306
    .line 307
    move-object/from16 v16, v6

    .line 308
    .line 309
    const/4 v6, 0x0

    .line 310
    iput-boolean v6, v9, Ls1;->b:Z

    .line 311
    .line 312
    invoke-interface {v10, v3, v1}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z

    .line 313
    .line 314
    .line 315
    move-result v3

    .line 316
    invoke-static {v3}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    .line 317
    .line 318
    .line 319
    move-result-object v3

    .line 320
    goto :goto_2

    .line 321
    :cond_2
    move-object/from16 v16, v6

    .line 322
    .line 323
    const/4 v3, 0x0

    .line 324
    :goto_2
    if-nez v3, :cond_5

    .line 325
    .line 326
    const-string v3, "firebase_crashlytics_collection_enabled"

    .line 327
    .line 328
    :try_start_0
    invoke-virtual {v0}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    .line 329
    .line 330
    .line 331
    move-result-object v6

    .line 332
    if-eqz v6, :cond_3

    .line 333
    .line 334
    invoke-virtual {v0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    .line 335
    .line 336
    .line 337
    move-result-object v0

    .line 338
    const/16 v10, 0x80

    .line 339
    .line 340
    invoke-virtual {v6, v0, v10}, Landroid/content/pm/PackageManager;->getApplicationInfo(Ljava/lang/String;I)Landroid/content/pm/ApplicationInfo;

    .line 341
    .line 342
    .line 343
    move-result-object v0

    .line 344
    if-eqz v0, :cond_3

    .line 345
    .line 346
    iget-object v6, v0, Landroid/content/pm/ApplicationInfo;->metaData:Landroid/os/Bundle;

    .line 347
    .line 348
    if-eqz v6, :cond_3

    .line 349
    .line 350
    invoke-virtual {v6, v3}, Landroid/os/BaseBundle;->containsKey(Ljava/lang/String;)Z

    .line 351
    .line 352
    .line 353
    move-result v6

    .line 354
    if-eqz v6, :cond_3

    .line 355
    .line 356
    iget-object v0, v0, Landroid/content/pm/ApplicationInfo;->metaData:Landroid/os/Bundle;

    .line 357
    .line 358
    invoke-virtual {v0, v3}, Landroid/os/BaseBundle;->getBoolean(Ljava/lang/String;)Z

    .line 359
    .line 360
    .line 361
    move-result v0

    .line 362
    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    .line 363
    .line 364
    .line 365
    move-result-object v0
    :try_end_0
    .catch Landroid/content/pm/PackageManager$NameNotFoundException; {:try_start_0 .. :try_end_0} :catch_0

    .line 366
    goto :goto_3

    .line 367
    :catch_0
    move-exception v0

    .line 368
    const-string v3, "Could not read data collection permission from manifest"

    .line 369
    .line 370
    const-string v6, "FirebaseCrashlytics"

    .line 371
    .line 372
    invoke-static {v6, v3, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 373
    .line 374
    .line 375
    :cond_3
    const/4 v0, 0x0

    .line 376
    :goto_3
    if-nez v0, :cond_4

    .line 377
    .line 378
    const/4 v6, 0x0

    .line 379
    iput-boolean v6, v9, Ls1;->b:Z

    .line 380
    .line 381
    const/4 v3, 0x0

    .line 382
    goto :goto_4

    .line 383
    :cond_4
    iput-boolean v1, v9, Ls1;->b:Z

    .line 384
    .line 385
    sget-object v3, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    .line 386
    .line 387
    invoke-virtual {v3, v0}, Ljava/lang/Boolean;->equals(Ljava/lang/Object;)Z

    .line 388
    .line 389
    .line 390
    move-result v0

    .line 391
    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    .line 392
    .line 393
    .line 394
    move-result-object v0

    .line 395
    move-object v3, v0

    .line 396
    :cond_5
    :goto_4
    iput-object v3, v9, Ls1;->g:Ljava/lang/Object;

    .line 397
    .line 398
    monitor-enter v2

    .line 399
    :try_start_1
    invoke-virtual {v9}, Ls1;->f()Z

    .line 400
    .line 401
    .line 402
    move-result v0

    .line 403
    if-eqz v0, :cond_6

    .line 404
    .line 405
    iget-object v0, v9, Ls1;->f:Ljava/lang/Object;

    .line 406
    .line 407
    check-cast v0, Lcom/google/android/gms/tasks/TaskCompletionSource;

    .line 408
    .line 409
    const/4 v3, 0x0

    .line 410
    invoke-virtual {v0, v3}, Lcom/google/android/gms/tasks/TaskCompletionSource;->trySetResult(Ljava/lang/Object;)Z

    .line 411
    .line 412
    .line 413
    iput-boolean v1, v9, Ls1;->a:Z

    .line 414
    .line 415
    goto :goto_5

    .line 416
    :catchall_0
    move-exception v0

    .line 417
    goto/16 :goto_1b

    .line 418
    .line 419
    :cond_6
    const/4 v3, 0x0

    .line 420
    :goto_5
    monitor-exit v2
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    .line 421
    new-instance v0, Lum0;

    .line 422
    .line 423
    invoke-direct {v0, v13, v14, v4, v9}, Lum0;-><init>(Landroid/content/Context;Ljava/lang/String;Lb60;Ls1;)V

    .line 424
    .line 425
    .line 426
    new-instance v2, Lpp;

    .line 427
    .line 428
    invoke-direct {v2, v5}, Lpp;-><init>(Ld61;)V

    .line 429
    .line 430
    .line 431
    new-instance v4, Lv3;

    .line 432
    .line 433
    invoke-direct {v4, v7}, Lv3;-><init>(Ld61;)V

    .line 434
    .line 435
    .line 436
    move-object v14, v13

    .line 437
    new-instance v13, Lap;

    .line 438
    .line 439
    invoke-direct {v13, v9, v12}, Lap;-><init>(Ls1;Li40;)V

    .line 440
    .line 441
    .line 442
    sget-object v5, Ly60;->a:Ly60;

    .line 443
    .line 444
    const-string v5, "Subscriber "

    .line 445
    .line 446
    const-string v6, "FirebaseSessions"

    .line 447
    .line 448
    sget-object v7, Ldm1;->a:Ldm1;

    .line 449
    .line 450
    sget-object v10, Ly60;->a:Ly60;

    .line 451
    .line 452
    invoke-static {v7}, Ly60;->a(Ldm1;)Lw60;

    .line 453
    .line 454
    .line 455
    move-result-object v10

    .line 456
    iget-object v3, v10, Lw60;->b:Lap;

    .line 457
    .line 458
    if-eqz v3, :cond_7

    .line 459
    .line 460
    new-instance v3, Ljava/lang/StringBuilder;

    .line 461
    .line 462
    invoke-direct {v3, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 463
    .line 464
    .line 465
    invoke-virtual {v3, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    .line 466
    .line 467
    .line 468
    const-string v5, " already registered."

    .line 469
    .line 470
    invoke-virtual {v3, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 471
    .line 472
    .line 473
    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 474
    .line 475
    .line 476
    move-result-object v3

    .line 477
    invoke-static {v6, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 478
    .line 479
    .line 480
    :goto_6
    move-object v3, v14

    .line 481
    goto :goto_7

    .line 482
    :cond_7
    iput-object v13, v10, Lw60;->b:Lap;

    .line 483
    .line 484
    new-instance v3, Ljava/lang/StringBuilder;

    .line 485
    .line 486
    invoke-direct {v3, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 487
    .line 488
    .line 489
    invoke-virtual {v3, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    .line 490
    .line 491
    .line 492
    const-string v5, " registered."

    .line 493
    .line 494
    invoke-virtual {v3, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 495
    .line 496
    .line 497
    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 498
    .line 499
    .line 500
    move-result-object v3

    .line 501
    invoke-static {v6, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 502
    .line 503
    .line 504
    iget-object v3, v10, Lw60;->a:Ljava/util/concurrent/CountDownLatch;

    .line 505
    .line 506
    invoke-virtual {v3}, Ljava/util/concurrent/CountDownLatch;->countDown()V

    .line 507
    .line 508
    .line 509
    goto :goto_6

    .line 510
    :goto_7
    new-instance v14, Laa0;

    .line 511
    .line 512
    const/16 v5, 0x8

    .line 513
    .line 514
    invoke-direct {v14, v8, v5}, Laa0;-><init>(Ljava/lang/Object;I)V

    .line 515
    .line 516
    .line 517
    new-instance v5, Lnp;

    .line 518
    .line 519
    new-instance v10, Lu3;

    .line 520
    .line 521
    invoke-direct {v10, v4}, Lu3;-><init>(Lv3;)V

    .line 522
    .line 523
    .line 524
    move-object v6, v11

    .line 525
    new-instance v11, Lu3;

    .line 526
    .line 527
    invoke-direct {v11, v4}, Lu3;-><init>(Lv3;)V

    .line 528
    .line 529
    .line 530
    move-object/from16 v4, p1

    .line 531
    .line 532
    move-object v7, v0

    .line 533
    move-object v8, v2

    .line 534
    move-object v1, v3

    .line 535
    move-object v3, v6

    .line 536
    move-object/from16 v6, v16

    .line 537
    .line 538
    const/4 v2, 0x0

    .line 539
    invoke-direct/range {v5 .. v15}, Lnp;-><init>(Lx40;Lum0;Lpp;Ls1;Lu3;Lu3;Li40;Lap;Laa0;Lxa6;)V

    .line 540
    .line 541
    .line 542
    move-object v14, v7

    .line 543
    move-object/from16 v20, v9

    .line 544
    .line 545
    move-object v7, v5

    .line 546
    move-object v5, v15

    .line 547
    iget-object v0, v7, Lnp;->p:Lxa6;

    .line 548
    .line 549
    invoke-virtual {v6}, Lx40;->b()V

    .line 550
    .line 551
    .line 552
    iget-object v6, v6, Lx40;->c:Lm60;

    .line 553
    .line 554
    iget-object v15, v6, Lm60;->b:Ljava/lang/String;

    .line 555
    .line 556
    const-string v6, "com.google.firebase.crashlytics.mapping_file_id"

    .line 557
    .line 558
    const-string v8, "string"

    .line 559
    .line 560
    invoke-static {v1, v6, v8}, Lmj;->t(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)I

    .line 561
    .line 562
    .line 563
    move-result v6

    .line 564
    if-nez v6, :cond_8

    .line 565
    .line 566
    const-string v6, "com.crashlytics.android.build_id"

    .line 567
    .line 568
    invoke-static {v1, v6, v8}, Lmj;->t(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)I

    .line 569
    .line 570
    .line 571
    move-result v6

    .line 572
    :cond_8
    if-eqz v6, :cond_9

    .line 573
    .line 574
    invoke-virtual {v1}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 575
    .line 576
    .line 577
    move-result-object v8

    .line 578
    invoke-virtual {v8, v6}, Landroid/content/res/Resources;->getString(I)Ljava/lang/String;

    .line 579
    .line 580
    .line 581
    move-result-object v6

    .line 582
    goto :goto_8

    .line 583
    :cond_9
    move-object v6, v2

    .line 584
    :goto_8
    new-instance v8, Ljava/util/ArrayList;

    .line 585
    .line 586
    invoke-direct {v8}, Ljava/util/ArrayList;-><init>()V

    .line 587
    .line 588
    .line 589
    const-string v9, "com.google.firebase.crashlytics.build_ids_lib"

    .line 590
    .line 591
    const-string v10, "array"

    .line 592
    .line 593
    invoke-static {v1, v9, v10}, Lmj;->t(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)I

    .line 594
    .line 595
    .line 596
    move-result v9

    .line 597
    const-string v11, "com.google.firebase.crashlytics.build_ids_arch"

    .line 598
    .line 599
    invoke-static {v1, v11, v10}, Lmj;->t(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)I

    .line 600
    .line 601
    .line 602
    move-result v11

    .line 603
    const-string v13, "com.google.firebase.crashlytics.build_ids_build_id"

    .line 604
    .line 605
    invoke-static {v1, v13, v10}, Lmj;->t(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)I

    .line 606
    .line 607
    .line 608
    move-result v10

    .line 609
    if-eqz v9, :cond_a

    .line 610
    .line 611
    if-eqz v11, :cond_a

    .line 612
    .line 613
    if-nez v10, :cond_b

    .line 614
    .line 615
    :cond_a
    move-object/from16 v19, v5

    .line 616
    .line 617
    move-object/from16 v25, v7

    .line 618
    .line 619
    goto/16 :goto_c

    .line 620
    .line 621
    :cond_b
    invoke-virtual {v1}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 622
    .line 623
    .line 624
    move-result-object v2

    .line 625
    invoke-virtual {v2, v9}, Landroid/content/res/Resources;->getStringArray(I)[Ljava/lang/String;

    .line 626
    .line 627
    .line 628
    move-result-object v2

    .line 629
    invoke-virtual {v1}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 630
    .line 631
    .line 632
    move-result-object v9

    .line 633
    invoke-virtual {v9, v11}, Landroid/content/res/Resources;->getStringArray(I)[Ljava/lang/String;

    .line 634
    .line 635
    .line 636
    move-result-object v9

    .line 637
    invoke-virtual {v1}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 638
    .line 639
    .line 640
    move-result-object v11

    .line 641
    invoke-virtual {v11, v10}, Landroid/content/res/Resources;->getStringArray(I)[Ljava/lang/String;

    .line 642
    .line 643
    .line 644
    move-result-object v10

    .line 645
    array-length v11, v2

    .line 646
    array-length v13, v10

    .line 647
    if-ne v11, v13, :cond_c

    .line 648
    .line 649
    array-length v11, v9

    .line 650
    array-length v13, v10

    .line 651
    if-eq v11, v13, :cond_d

    .line 652
    .line 653
    :cond_c
    move-object/from16 v19, v5

    .line 654
    .line 655
    move-object/from16 v25, v7

    .line 656
    .line 657
    goto :goto_b

    .line 658
    :cond_d
    const/4 v11, 0x0

    .line 659
    :goto_9
    array-length v13, v10

    .line 660
    if-ge v11, v13, :cond_e

    .line 661
    .line 662
    new-instance v13, Laf;

    .line 663
    .line 664
    move-object/from16 v19, v5

    .line 665
    .line 666
    aget-object v5, v2, v11

    .line 667
    .line 668
    move-object/from16 v25, v7

    .line 669
    .line 670
    aget-object v7, v9, v11

    .line 671
    .line 672
    move/from16 v17, v11

    .line 673
    .line 674
    aget-object v11, v10, v17

    .line 675
    .line 676
    invoke-direct {v13, v5, v7, v11}, Laf;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 677
    .line 678
    .line 679
    invoke-virtual {v8, v13}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 680
    .line 681
    .line 682
    add-int/lit8 v11, v17, 0x1

    .line 683
    .line 684
    move-object/from16 v5, v19

    .line 685
    .line 686
    move-object/from16 v7, v25

    .line 687
    .line 688
    goto :goto_9

    .line 689
    :cond_e
    move-object/from16 v19, v5

    .line 690
    .line 691
    move-object/from16 v25, v7

    .line 692
    .line 693
    :cond_f
    :goto_a
    const/4 v5, 0x3

    .line 694
    :cond_10
    const/4 v7, 0x0

    .line 695
    goto :goto_d

    .line 696
    :goto_b
    const-string v5, "Lengths did not match: %d %d %d"

    .line 697
    .line 698
    array-length v2, v2

    .line 699
    invoke-static {v2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 700
    .line 701
    .line 702
    move-result-object v2

    .line 703
    array-length v7, v9

    .line 704
    invoke-static {v7}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 705
    .line 706
    .line 707
    move-result-object v7

    .line 708
    array-length v9, v10

    .line 709
    invoke-static {v9}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 710
    .line 711
    .line 712
    move-result-object v9

    .line 713
    filled-new-array {v2, v7, v9}, [Ljava/lang/Object;

    .line 714
    .line 715
    .line 716
    move-result-object v2

    .line 717
    invoke-static {v5, v2}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 718
    .line 719
    .line 720
    move-result-object v2

    .line 721
    const/4 v5, 0x3

    .line 722
    invoke-static {v4, v5}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 723
    .line 724
    .line 725
    move-result v7

    .line 726
    if-eqz v7, :cond_f

    .line 727
    .line 728
    const/4 v5, 0x0

    .line 729
    invoke-static {v4, v2, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 730
    .line 731
    .line 732
    goto :goto_a

    .line 733
    :goto_c
    const-string v2, "Could not find resources: %d %d %d"

    .line 734
    .line 735
    invoke-static {v9}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 736
    .line 737
    .line 738
    move-result-object v5

    .line 739
    invoke-static {v11}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 740
    .line 741
    .line 742
    move-result-object v7

    .line 743
    invoke-static {v10}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 744
    .line 745
    .line 746
    move-result-object v9

    .line 747
    filled-new-array {v5, v7, v9}, [Ljava/lang/Object;

    .line 748
    .line 749
    .line 750
    move-result-object v5

    .line 751
    invoke-static {v2, v5}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    .line 752
    .line 753
    .line 754
    move-result-object v2

    .line 755
    const/4 v5, 0x3

    .line 756
    invoke-static {v4, v5}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 757
    .line 758
    .line 759
    move-result v7

    .line 760
    if-eqz v7, :cond_10

    .line 761
    .line 762
    const/4 v7, 0x0

    .line 763
    invoke-static {v4, v2, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 764
    .line 765
    .line 766
    :goto_d
    const-string v2, "Mapping file ID is: "

    .line 767
    .line 768
    invoke-static {v2, v6}, Lbo;->j(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 769
    .line 770
    .line 771
    move-result-object v2

    .line 772
    invoke-static {v4, v5}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 773
    .line 774
    .line 775
    move-result v9

    .line 776
    if-eqz v9, :cond_11

    .line 777
    .line 778
    invoke-static {v4, v2, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 779
    .line 780
    .line 781
    :cond_11
    invoke-virtual {v8}, Ljava/util/ArrayList;->size()I

    .line 782
    .line 783
    .line 784
    move-result v2

    .line 785
    const/4 v5, 0x0

    .line 786
    :goto_e
    if-ge v5, v2, :cond_13

    .line 787
    .line 788
    invoke-virtual {v8, v5}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 789
    .line 790
    .line 791
    move-result-object v7

    .line 792
    add-int/lit8 v5, v5, 0x1

    .line 793
    .line 794
    check-cast v7, Laf;

    .line 795
    .line 796
    iget-object v9, v7, Laf;->a:Ljava/lang/String;

    .line 797
    .line 798
    iget-object v10, v7, Laf;->b:Ljava/lang/String;

    .line 799
    .line 800
    iget-object v7, v7, Laf;->c:Ljava/lang/String;

    .line 801
    .line 802
    const-string v11, "Build id for "

    .line 803
    .line 804
    const-string v13, " on "

    .line 805
    .line 806
    move/from16 v17, v2

    .line 807
    .line 808
    const-string v2, ": "

    .line 809
    .line 810
    invoke-static {v11, v9, v13, v10, v2}, Lcw1;->p(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 811
    .line 812
    .line 813
    move-result-object v2

    .line 814
    invoke-virtual {v2, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 815
    .line 816
    .line 817
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 818
    .line 819
    .line 820
    move-result-object v2

    .line 821
    const/4 v7, 0x3

    .line 822
    invoke-static {v4, v7}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 823
    .line 824
    .line 825
    move-result v9

    .line 826
    if-eqz v9, :cond_12

    .line 827
    .line 828
    const/4 v9, 0x0

    .line 829
    invoke-static {v4, v2, v9}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 830
    .line 831
    .line 832
    :cond_12
    move/from16 v2, v17

    .line 833
    .line 834
    goto :goto_e

    .line 835
    :cond_13
    const/4 v7, 0x3

    .line 836
    new-instance v2, Ld04;

    .line 837
    .line 838
    const/4 v5, 0x7

    .line 839
    invoke-direct {v2, v1, v5}, Ld04;-><init>(Ljava/lang/Object;I)V

    .line 840
    .line 841
    .line 842
    move-object v13, v1

    .line 843
    move-object/from16 v18, v2

    .line 844
    .line 845
    move-object/from16 v16, v6

    .line 846
    .line 847
    move v1, v7

    .line 848
    move-object/from16 v17, v8

    .line 849
    .line 850
    :try_start_2
    invoke-static/range {v13 .. v18}, Lo5;->a(Landroid/content/Context;Lum0;Ljava/lang/String;Ljava/lang/String;Ljava/util/ArrayList;Ld04;)Lo5;

    .line 851
    .line 852
    .line 853
    move-result-object v2
    :try_end_2
    .catch Landroid/content/pm/PackageManager$NameNotFoundException; {:try_start_2 .. :try_end_2} :catch_3

    .line 854
    move-object v7, v14

    .line 855
    move-object v14, v13

    .line 856
    new-instance v6, Ljava/lang/StringBuilder;

    .line 857
    .line 858
    const-string v8, "Installer package name is: "

    .line 859
    .line 860
    invoke-direct {v6, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 861
    .line 862
    .line 863
    iget-object v8, v2, Lo5;->d:Ljava/lang/String;

    .line 864
    .line 865
    invoke-virtual {v6, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 866
    .line 867
    .line 868
    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 869
    .line 870
    .line 871
    move-result-object v6

    .line 872
    const/4 v13, 0x2

    .line 873
    invoke-static {v4, v13}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 874
    .line 875
    .line 876
    move-result v8

    .line 877
    if-eqz v8, :cond_14

    .line 878
    .line 879
    const/4 v9, 0x0

    .line 880
    invoke-static {v4, v6, v9}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 881
    .line 882
    .line 883
    :cond_14
    new-instance v6, Lkw;

    .line 884
    .line 885
    const/16 v8, 0xb

    .line 886
    .line 887
    invoke-direct {v6, v8}, Lkw;-><init>(I)V

    .line 888
    .line 889
    .line 890
    iget-object v11, v2, Lo5;->f:Ljava/lang/String;

    .line 891
    .line 892
    iget-object v10, v2, Lo5;->g:Ljava/lang/String;

    .line 893
    .line 894
    invoke-virtual {v7}, Lum0;->d()Ljava/lang/String;

    .line 895
    .line 896
    .line 897
    move-result-object v9

    .line 898
    new-instance v13, Lek1;

    .line 899
    .line 900
    invoke-direct {v13, v5}, Lek1;-><init>(I)V

    .line 901
    .line 902
    .line 903
    new-instance v5, Lph1;

    .line 904
    .line 905
    invoke-direct {v5, v13}, Lph1;-><init>(Ljava/lang/Object;)V

    .line 906
    .line 907
    .line 908
    new-instance v1, Lh55;

    .line 909
    .line 910
    invoke-direct {v1, v12}, Lh55;-><init>(Li40;)V

    .line 911
    .line 912
    .line 913
    sget-object v12, Ljava/util/Locale;->US:Ljava/util/Locale;

    .line 914
    .line 915
    const-string v12, "https://firebase-settings.crashlytics.com/spi/v2/platforms/android/gmp/"

    .line 916
    .line 917
    const-string v8, "/settings"

    .line 918
    .line 919
    invoke-static {v12, v15, v8}, Lbo;->w(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 920
    .line 921
    .line 922
    move-result-object v8

    .line 923
    new-instance v12, Lr34;

    .line 924
    .line 925
    invoke-direct {v12, v8, v6}, Lr34;-><init>(Ljava/lang/String;Lkw;)V

    .line 926
    .line 927
    .line 928
    sget-object v6, Landroid/os/Build;->MANUFACTURER:Ljava/lang/String;

    .line 929
    .line 930
    sget-object v8, Lum0;->h:Ljava/lang/String;

    .line 931
    .line 932
    move-object/from16 v18, v1

    .line 933
    .line 934
    const-string v1, ""

    .line 935
    .line 936
    invoke-virtual {v6, v8, v1}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 937
    .line 938
    .line 939
    move-result-object v1

    .line 940
    sget-object v6, Landroid/os/Build;->MODEL:Ljava/lang/String;

    .line 941
    .line 942
    move-object/from16 v26, v4

    .line 943
    .line 944
    const-string v4, ""

    .line 945
    .line 946
    invoke-virtual {v6, v8, v4}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 947
    .line 948
    .line 949
    move-result-object v4

    .line 950
    const-string v6, "/"

    .line 951
    .line 952
    invoke-static {v1, v6, v4}, Lbo;->k(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 953
    .line 954
    .line 955
    move-result-object v1

    .line 956
    sget-object v4, Landroid/os/Build$VERSION;->INCREMENTAL:Ljava/lang/String;

    .line 957
    .line 958
    const-string v6, ""

    .line 959
    .line 960
    invoke-virtual {v4, v8, v6}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 961
    .line 962
    .line 963
    move-result-object v6

    .line 964
    sget-object v4, Landroid/os/Build$VERSION;->RELEASE:Ljava/lang/String;

    .line 965
    .line 966
    move-object/from16 v27, v1

    .line 967
    .line 968
    const-string v1, ""

    .line 969
    .line 970
    invoke-virtual {v4, v8, v1}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 971
    .line 972
    .line 973
    move-result-object v1

    .line 974
    const-string v4, "com.google.firebase.crashlytics.mapping_file_id"

    .line 975
    .line 976
    const-string v8, "string"

    .line 977
    .line 978
    invoke-static {v14, v4, v8}, Lmj;->t(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)I

    .line 979
    .line 980
    .line 981
    move-result v4

    .line 982
    if-nez v4, :cond_15

    .line 983
    .line 984
    const-string v4, "com.crashlytics.android.build_id"

    .line 985
    .line 986
    invoke-static {v14, v4, v8}, Lmj;->t(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)I

    .line 987
    .line 988
    .line 989
    move-result v4

    .line 990
    :cond_15
    if-eqz v4, :cond_16

    .line 991
    .line 992
    invoke-virtual {v14}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    .line 993
    .line 994
    .line 995
    move-result-object v8

    .line 996
    invoke-virtual {v8, v4}, Landroid/content/res/Resources;->getString(I)Ljava/lang/String;

    .line 997
    .line 998
    .line 999
    move-result-object v4

    .line 1000
    goto :goto_f

    .line 1001
    :cond_16
    const/4 v4, 0x0

    .line 1002
    :goto_f
    filled-new-array {v4, v15, v10, v11}, [Ljava/lang/String;

    .line 1003
    .line 1004
    .line 1005
    move-result-object v4

    .line 1006
    new-instance v8, Ljava/util/ArrayList;

    .line 1007
    .line 1008
    invoke-direct {v8}, Ljava/util/ArrayList;-><init>()V

    .line 1009
    .line 1010
    .line 1011
    move-object/from16 v40, v0

    .line 1012
    .line 1013
    move-object/from16 v28, v1

    .line 1014
    .line 1015
    const/4 v1, 0x0

    .line 1016
    :goto_10
    const/4 v0, 0x4

    .line 1017
    if-ge v1, v0, :cond_18

    .line 1018
    .line 1019
    aget-object v0, v4, v1

    .line 1020
    .line 1021
    move/from16 v29, v1

    .line 1022
    .line 1023
    if-eqz v0, :cond_17

    .line 1024
    .line 1025
    const-string v1, "-"

    .line 1026
    .line 1027
    invoke-virtual {v0, v1, v3}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    .line 1028
    .line 1029
    .line 1030
    move-result-object v0

    .line 1031
    sget-object v1, Ljava/util/Locale;->US:Ljava/util/Locale;

    .line 1032
    .line 1033
    invoke-virtual {v0, v1}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    .line 1034
    .line 1035
    .line 1036
    move-result-object v0

    .line 1037
    invoke-virtual {v8, v0}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 1038
    .line 1039
    .line 1040
    :cond_17
    add-int/lit8 v1, v29, 0x1

    .line 1041
    .line 1042
    goto :goto_10

    .line 1043
    :cond_18
    invoke-static {v8}, Ljava/util/Collections;->sort(Ljava/util/List;)V

    .line 1044
    .line 1045
    .line 1046
    new-instance v1, Ljava/lang/StringBuilder;

    .line 1047
    .line 1048
    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    .line 1049
    .line 1050
    .line 1051
    invoke-virtual {v8}, Ljava/util/ArrayList;->size()I

    .line 1052
    .line 1053
    .line 1054
    move-result v4

    .line 1055
    const/4 v0, 0x0

    .line 1056
    :goto_11
    if-ge v0, v4, :cond_19

    .line 1057
    .line 1058
    invoke-virtual {v8, v0}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    .line 1059
    .line 1060
    .line 1061
    move-result-object v29

    .line 1062
    add-int/lit8 v0, v0, 0x1

    .line 1063
    .line 1064
    move/from16 v30, v0

    .line 1065
    .line 1066
    move-object/from16 v0, v29

    .line 1067
    .line 1068
    check-cast v0, Ljava/lang/String;

    .line 1069
    .line 1070
    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1071
    .line 1072
    .line 1073
    move/from16 v0, v30

    .line 1074
    .line 1075
    goto :goto_11

    .line 1076
    :cond_19
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 1077
    .line 1078
    .line 1079
    move-result-object v0

    .line 1080
    invoke-virtual {v0}, Ljava/lang/String;->length()I

    .line 1081
    .line 1082
    .line 1083
    move-result v1

    .line 1084
    if-lez v1, :cond_1a

    .line 1085
    .line 1086
    invoke-static {v0}, Lmj;->C(Ljava/lang/String;)Ljava/lang/String;

    .line 1087
    .line 1088
    .line 1089
    move-result-object v0

    .line 1090
    move-object/from16 v41, v9

    .line 1091
    .line 1092
    move-object v9, v0

    .line 1093
    move-object/from16 v0, v41

    .line 1094
    .line 1095
    goto :goto_12

    .line 1096
    :cond_1a
    move-object v0, v9

    .line 1097
    const/4 v9, 0x0

    .line 1098
    :goto_12
    if-eqz v0, :cond_1b

    .line 1099
    .line 1100
    const/4 v0, 0x4

    .line 1101
    goto :goto_13

    .line 1102
    :cond_1b
    const/4 v0, 0x1

    .line 1103
    :goto_13
    invoke-static {v0}, Lbo;->c(I)I

    .line 1104
    .line 1105
    .line 1106
    move-result v0

    .line 1107
    move-object v1, v3

    .line 1108
    new-instance v3, Lum1;

    .line 1109
    .line 1110
    move-object/from16 v29, v2

    .line 1111
    .line 1112
    move-object/from16 v17, v5

    .line 1113
    .line 1114
    move-object v8, v7

    .line 1115
    move-object v4, v15

    .line 1116
    move-object/from16 v15, v19

    .line 1117
    .line 1118
    move-object/from16 v2, v25

    .line 1119
    .line 1120
    move-object/from16 v5, v27

    .line 1121
    .line 1122
    move-object/from16 v7, v28

    .line 1123
    .line 1124
    move-object/from16 v19, v12

    .line 1125
    .line 1126
    move v12, v0

    .line 1127
    const/16 v0, 0xb

    .line 1128
    .line 1129
    invoke-direct/range {v3 .. v12}, Lum1;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lum0;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V

    .line 1130
    .line 1131
    .line 1132
    new-instance v33, Lip2;

    .line 1133
    .line 1134
    move-object/from16 v16, v13

    .line 1135
    .line 1136
    move-object v5, v15

    .line 1137
    move-object/from16 v4, v26

    .line 1138
    .line 1139
    move-object/from16 v13, v33

    .line 1140
    .line 1141
    move-object v15, v3

    .line 1142
    const/4 v3, 0x2

    .line 1143
    invoke-direct/range {v13 .. v20}, Lip2;-><init>(Landroid/content/Context;Lum1;Lek1;Lph1;Lh55;Lr34;Ls1;)V

    .line 1144
    .line 1145
    .line 1146
    iget-object v6, v13, Lip2;->L:Ljava/lang/Object;

    .line 1147
    .line 1148
    check-cast v6, Ljava/util/concurrent/atomic/AtomicReference;

    .line 1149
    .line 1150
    iget-object v7, v13, Lip2;->K:Ljava/lang/Object;

    .line 1151
    .line 1152
    check-cast v7, Ljava/util/concurrent/atomic/AtomicReference;

    .line 1153
    .line 1154
    iget-object v8, v13, Lip2;->b:Ljava/lang/Object;

    .line 1155
    .line 1156
    check-cast v8, Landroid/content/Context;

    .line 1157
    .line 1158
    const-string v9, "com.google.firebase.crashlytics"

    .line 1159
    .line 1160
    const/4 v10, 0x0

    .line 1161
    invoke-virtual {v8, v9, v10}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    .line 1162
    .line 1163
    .line 1164
    move-result-object v8

    .line 1165
    const-string v9, "existing_instance_identifier"

    .line 1166
    .line 1167
    invoke-interface {v8, v9, v1}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    .line 1168
    .line 1169
    .line 1170
    move-result-object v1

    .line 1171
    iget-object v8, v13, Lip2;->c:Ljava/lang/Object;

    .line 1172
    .line 1173
    check-cast v8, Lum1;

    .line 1174
    .line 1175
    iget-object v8, v8, Lum1;->f:Ljava/lang/String;

    .line 1176
    .line 1177
    invoke-virtual {v1, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    .line 1178
    .line 1179
    .line 1180
    move-result v1

    .line 1181
    if-eqz v1, :cond_1c

    .line 1182
    .line 1183
    const/4 v1, 0x1

    .line 1184
    invoke-virtual {v13, v1}, Lip2;->a(I)Llm1;

    .line 1185
    .line 1186
    .line 1187
    move-result-object v8

    .line 1188
    if-eqz v8, :cond_1c

    .line 1189
    .line 1190
    invoke-virtual {v7, v8}, Ljava/util/concurrent/atomic/AtomicReference;->set(Ljava/lang/Object;)V

    .line 1191
    .line 1192
    .line 1193
    invoke-virtual {v6}, Ljava/util/concurrent/atomic/AtomicReference;->get()Ljava/lang/Object;

    .line 1194
    .line 1195
    .line 1196
    move-result-object v1

    .line 1197
    check-cast v1, Lcom/google/android/gms/tasks/TaskCompletionSource;

    .line 1198
    .line 1199
    invoke-virtual {v1, v8}, Lcom/google/android/gms/tasks/TaskCompletionSource;->trySetResult(Ljava/lang/Object;)Z

    .line 1200
    .line 1201
    .line 1202
    const/4 v9, 0x0

    .line 1203
    invoke-static {v9}, Lcom/google/android/gms/tasks/Tasks;->forResult(Ljava/lang/Object;)Lcom/google/android/gms/tasks/Task;

    .line 1204
    .line 1205
    .line 1206
    move-result-object v1

    .line 1207
    goto :goto_14

    .line 1208
    :cond_1c
    const/4 v1, 0x3

    .line 1209
    invoke-virtual {v13, v1}, Lip2;->a(I)Llm1;

    .line 1210
    .line 1211
    .line 1212
    move-result-object v8

    .line 1213
    if-eqz v8, :cond_1d

    .line 1214
    .line 1215
    invoke-virtual {v7, v8}, Ljava/util/concurrent/atomic/AtomicReference;->set(Ljava/lang/Object;)V

    .line 1216
    .line 1217
    .line 1218
    invoke-virtual {v6}, Ljava/util/concurrent/atomic/AtomicReference;->get()Ljava/lang/Object;

    .line 1219
    .line 1220
    .line 1221
    move-result-object v1

    .line 1222
    check-cast v1, Lcom/google/android/gms/tasks/TaskCompletionSource;

    .line 1223
    .line 1224
    invoke-virtual {v1, v8}, Lcom/google/android/gms/tasks/TaskCompletionSource;->trySetResult(Ljava/lang/Object;)Z

    .line 1225
    .line 1226
    .line 1227
    :cond_1d
    iget-object v1, v13, Lip2;->J:Ljava/lang/Object;

    .line 1228
    .line 1229
    check-cast v1, Ls1;

    .line 1230
    .line 1231
    iget-object v6, v1, Ls1;->h:Ljava/lang/Object;

    .line 1232
    .line 1233
    check-cast v6, Lcom/google/android/gms/tasks/TaskCompletionSource;

    .line 1234
    .line 1235
    invoke-virtual {v6}, Lcom/google/android/gms/tasks/TaskCompletionSource;->getTask()Lcom/google/android/gms/tasks/Task;

    .line 1236
    .line 1237
    .line 1238
    move-result-object v6

    .line 1239
    iget-object v7, v1, Ls1;->e:Ljava/lang/Object;

    .line 1240
    .line 1241
    monitor-enter v7

    .line 1242
    :try_start_3
    iget-object v1, v1, Ls1;->f:Ljava/lang/Object;

    .line 1243
    .line 1244
    check-cast v1, Lcom/google/android/gms/tasks/TaskCompletionSource;

    .line 1245
    .line 1246
    invoke-virtual {v1}, Lcom/google/android/gms/tasks/TaskCompletionSource;->getTask()Lcom/google/android/gms/tasks/Task;

    .line 1247
    .line 1248
    .line 1249
    move-result-object v1

    .line 1250
    monitor-exit v7
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_1

    .line 1251
    invoke-static {v6, v1}, Ltu;->m(Lcom/google/android/gms/tasks/Task;Lcom/google/android/gms/tasks/Task;)Lcom/google/android/gms/tasks/Task;

    .line 1252
    .line 1253
    .line 1254
    move-result-object v1

    .line 1255
    iget-object v6, v5, Lxa6;->b:Ljava/lang/Object;

    .line 1256
    .line 1257
    check-cast v6, Lyq;

    .line 1258
    .line 1259
    new-instance v7, Ld04;

    .line 1260
    .line 1261
    const/16 v8, 0x12

    .line 1262
    .line 1263
    const/4 v10, 0x0

    .line 1264
    invoke-direct {v7, v13, v5, v10, v8}, Ld04;-><init>(Ljava/lang/Object;Ljava/lang/Object;ZI)V

    .line 1265
    .line 1266
    .line 1267
    invoke-virtual {v1, v6, v7}, Lcom/google/android/gms/tasks/Task;->onSuccessTask(Ljava/util/concurrent/Executor;Lcom/google/android/gms/tasks/SuccessContinuation;)Lcom/google/android/gms/tasks/Task;

    .line 1268
    .line 1269
    .line 1270
    move-result-object v1

    .line 1271
    :goto_14
    new-instance v5, Lh50;

    .line 1272
    .line 1273
    invoke-direct {v5}, Ljava/lang/Object;-><init>()V

    .line 1274
    .line 1275
    .line 1276
    move-object/from16 v6, v24

    .line 1277
    .line 1278
    invoke-virtual {v1, v6, v5}, Lcom/google/android/gms/tasks/Task;->addOnFailureListener(Ljava/util/concurrent/Executor;Lcom/google/android/gms/tasks/OnFailureListener;)Lcom/google/android/gms/tasks/Task;

    .line 1279
    .line 1280
    .line 1281
    iget-object v1, v2, Lnp;->j:Li40;

    .line 1282
    .line 1283
    const-string v5, "The Crashlytics build ID is missing. This occurs when the Crashlytics Gradle plugin is missing from your app\'s build configuration. Please review the Firebase Crashlytics onboarding instructions at https://firebase.google.com/docs/crashlytics/get-started?platform=android#add-plugin"

    .line 1284
    .line 1285
    iget-object v6, v2, Lnp;->a:Landroid/content/Context;

    .line 1286
    .line 1287
    const-string v7, "com.google.firebase.crashlytics.RequireBuildId"

    .line 1288
    .line 1289
    const-string v8, "com.crashlytics.RequireBuildId"

    .line 1290
    .line 1291
    const/4 v9, 0x1

    .line 1292
    invoke-static {v6, v8, v9}, Lmj;->p(Landroid/content/Context;Ljava/lang/String;Z)Z

    .line 1293
    .line 1294
    .line 1295
    move-result v8

    .line 1296
    invoke-static {v6, v7, v8}, Lmj;->p(Landroid/content/Context;Ljava/lang/String;Z)Z

    .line 1297
    .line 1298
    .line 1299
    move-result v7

    .line 1300
    move-object/from16 v8, v29

    .line 1301
    .line 1302
    iget-object v9, v8, Lo5;->b:Ljava/lang/String;

    .line 1303
    .line 1304
    const-string v10, "."

    .line 1305
    .line 1306
    const-string v11, ".     |  |"

    .line 1307
    .line 1308
    if-nez v7, :cond_1e

    .line 1309
    .line 1310
    const-string v5, "Configured not to require a build ID."

    .line 1311
    .line 1312
    invoke-static {v4, v3}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 1313
    .line 1314
    .line 1315
    move-result v3

    .line 1316
    if-eqz v3, :cond_1f

    .line 1317
    .line 1318
    const/4 v9, 0x0

    .line 1319
    invoke-static {v4, v5, v9}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 1320
    .line 1321
    .line 1322
    goto :goto_15

    .line 1323
    :cond_1e
    invoke-static {v9}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    .line 1324
    .line 1325
    .line 1326
    move-result v3

    .line 1327
    if-nez v3, :cond_25

    .line 1328
    .line 1329
    :cond_1f
    :goto_15
    new-instance v3, Lhf;

    .line 1330
    .line 1331
    invoke-direct {v3}, Lhf;-><init>()V

    .line 1332
    .line 1333
    .line 1334
    iget-object v3, v3, Lhf;->a:Ljava/lang/String;

    .line 1335
    .line 1336
    :try_start_4
    new-instance v5, Lop5;

    .line 1337
    .line 1338
    const-string v7, "crash_marker"

    .line 1339
    .line 1340
    const/4 v9, 0x5

    .line 1341
    const/4 v10, 0x0

    .line 1342
    invoke-direct {v5, v7, v1, v10, v9}, Lop5;-><init>(Ljava/lang/Object;Ljava/lang/Object;ZI)V

    .line 1343
    .line 1344
    .line 1345
    iput-object v5, v2, Lnp;->f:Lop5;

    .line 1346
    .line 1347
    new-instance v5, Lop5;

    .line 1348
    .line 1349
    const-string v7, "initialization_marker"

    .line 1350
    .line 1351
    invoke-direct {v5, v7, v1, v10, v9}, Lop5;-><init>(Ljava/lang/Object;Ljava/lang/Object;ZI)V

    .line 1352
    .line 1353
    .line 1354
    iput-object v5, v2, Lnp;->e:Lop5;

    .line 1355
    .line 1356
    new-instance v5, Li40;

    .line 1357
    .line 1358
    move-object/from16 v7, v40

    .line 1359
    .line 1360
    invoke-direct {v5, v3, v1, v7}, Li40;-><init>(Ljava/lang/String;Li40;Lxa6;)V

    .line 1361
    .line 1362
    .line 1363
    new-instance v9, Ld04;

    .line 1364
    .line 1365
    invoke-direct {v9, v1}, Ld04;-><init>(Li40;)V

    .line 1366
    .line 1367
    .line 1368
    new-instance v1, Ljb4;

    .line 1369
    .line 1370
    new-instance v10, Lkw;

    .line 1371
    .line 1372
    const/16 v11, 0x1b

    .line 1373
    .line 1374
    invoke-direct {v10, v11}, Lkw;-><init>(I)V

    .line 1375
    .line 1376
    .line 1377
    const/4 v11, 0x1

    .line 1378
    new-array v11, v11, [Lcr1;

    .line 1379
    .line 1380
    const/16 v23, 0x0

    .line 1381
    .line 1382
    aput-object v10, v11, v23

    .line 1383
    .line 1384
    invoke-direct {v1, v11}, Ljb4;-><init>([Lcr1;)V

    .line 1385
    .line 1386
    .line 1387
    iget-object v10, v2, Lnp;->o:Laa0;

    .line 1388
    .line 1389
    iget-object v10, v10, Laa0;->b:Ljava/lang/Object;

    .line 1390
    .line 1391
    check-cast v10, Ld61;

    .line 1392
    .line 1393
    new-instance v11, Lm81;

    .line 1394
    .line 1395
    const/16 v12, 0x10

    .line 1396
    .line 1397
    invoke-direct {v11, v12}, Lm81;-><init>(I)V

    .line 1398
    .line 1399
    .line 1400
    invoke-virtual {v10, v11}, Ld61;->a(Liw;)V

    .line 1401
    .line 1402
    .line 1403
    iget-object v10, v2, Lnp;->a:Landroid/content/Context;

    .line 1404
    .line 1405
    iget-object v11, v2, Lnp;->i:Lum0;

    .line 1406
    .line 1407
    iget-object v12, v2, Lnp;->j:Li40;

    .line 1408
    .line 1409
    iget-object v14, v2, Lnp;->c:Ler3;

    .line 1410
    .line 1411
    iget-object v15, v2, Lnp;->m:Lap;

    .line 1412
    .line 1413
    iget-object v0, v2, Lnp;->p:Lxa6;

    .line 1414
    .line 1415
    move-object/from16 v36, v0

    .line 1416
    .line 1417
    move-object/from16 v32, v1

    .line 1418
    .line 1419
    move-object/from16 v31, v5

    .line 1420
    .line 1421
    move-object/from16 v29, v8

    .line 1422
    .line 1423
    move-object/from16 v30, v9

    .line 1424
    .line 1425
    move-object/from16 v26, v10

    .line 1426
    .line 1427
    move-object/from16 v27, v11

    .line 1428
    .line 1429
    move-object/from16 v28, v12

    .line 1430
    .line 1431
    move-object/from16 v33, v13

    .line 1432
    .line 1433
    move-object/from16 v34, v14

    .line 1434
    .line 1435
    move-object/from16 v35, v15

    .line 1436
    .line 1437
    invoke-static/range {v26 .. v36}, Lcm1;->d(Landroid/content/Context;Lum0;Li40;Lo5;Ld04;Li40;Ljb4;Lip2;Ler3;Lap;Lxa6;)Lcm1;

    .line 1438
    .line 1439
    .line 1440
    move-result-object v35

    .line 1441
    move-object/from16 v13, v33

    .line 1442
    .line 1443
    new-instance v26, Lfp;

    .line 1444
    .line 1445
    iget-object v0, v2, Lnp;->a:Landroid/content/Context;

    .line 1446
    .line 1447
    iget-object v1, v2, Lnp;->i:Lum0;

    .line 1448
    .line 1449
    iget-object v5, v2, Lnp;->b:Ls1;

    .line 1450
    .line 1451
    iget-object v8, v2, Lnp;->j:Li40;

    .line 1452
    .line 1453
    iget-object v9, v2, Lnp;->f:Lop5;

    .line 1454
    .line 1455
    iget-object v10, v2, Lnp;->n:Lpp;

    .line 1456
    .line 1457
    iget-object v11, v2, Lnp;->l:Lu3;

    .line 1458
    .line 1459
    iget-object v12, v2, Lnp;->m:Lap;

    .line 1460
    .line 1461
    iget-object v14, v2, Lnp;->p:Lxa6;

    .line 1462
    .line 1463
    move-object/from16 v27, v0

    .line 1464
    .line 1465
    move-object/from16 v28, v1

    .line 1466
    .line 1467
    move-object/from16 v36, v10

    .line 1468
    .line 1469
    move-object/from16 v37, v11

    .line 1470
    .line 1471
    move-object/from16 v38, v12

    .line 1472
    .line 1473
    move-object/from16 v39, v14

    .line 1474
    .line 1475
    move-object/from16 v32, v29

    .line 1476
    .line 1477
    move-object/from16 v34, v30

    .line 1478
    .line 1479
    move-object/from16 v33, v31

    .line 1480
    .line 1481
    move-object/from16 v29, v5

    .line 1482
    .line 1483
    move-object/from16 v30, v8

    .line 1484
    .line 1485
    move-object/from16 v31, v9

    .line 1486
    .line 1487
    invoke-direct/range {v26 .. v39}, Lfp;-><init>(Landroid/content/Context;Lum0;Ls1;Li40;Lop5;Lo5;Li40;Ld04;Lcm1;Lpp;Lx3;Lap;Lxa6;)V

    .line 1488
    .line 1489
    .line 1490
    move-object/from16 v0, v26

    .line 1491
    .line 1492
    iput-object v0, v2, Lnp;->h:Lfp;

    .line 1493
    .line 1494
    iget-object v0, v2, Lnp;->e:Lop5;

    .line 1495
    .line 1496
    iget-object v1, v0, Lop5;->c:Ljava/lang/Object;

    .line 1497
    .line 1498
    check-cast v1, Li40;

    .line 1499
    .line 1500
    iget-object v0, v0, Lop5;->b:Ljava/lang/Object;

    .line 1501
    .line 1502
    check-cast v0, Ljava/lang/String;

    .line 1503
    .line 1504
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 1505
    .line 1506
    .line 1507
    new-instance v5, Ljava/io/File;

    .line 1508
    .line 1509
    iget-object v1, v1, Li40;->c:Ljava/lang/Object;

    .line 1510
    .line 1511
    check-cast v1, Ljava/io/File;

    .line 1512
    .line 1513
    invoke-direct {v5, v1, v0}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 1514
    .line 1515
    .line 1516
    invoke-virtual {v5}, Ljava/io/File;->exists()Z

    .line 1517
    .line 1518
    .line 1519
    move-result v0

    .line 1520
    iget-object v1, v7, Lxa6;->b:Ljava/lang/Object;

    .line 1521
    .line 1522
    check-cast v1, Lyq;

    .line 1523
    .line 1524
    iget-object v1, v1, Lyq;->b:Ljava/lang/Object;

    .line 1525
    .line 1526
    check-cast v1, Ljava/util/concurrent/ExecutorService;

    .line 1527
    .line 1528
    new-instance v5, Ljp;

    .line 1529
    .line 1530
    const/4 v10, 0x0

    .line 1531
    invoke-direct {v5, v2, v10}, Ljp;-><init>(Ljava/lang/Object;I)V

    .line 1532
    .line 1533
    .line 1534
    invoke-interface {v1, v5}, Ljava/util/concurrent/ExecutorService;->submit(Ljava/util/concurrent/Callable;)Ljava/util/concurrent/Future;

    .line 1535
    .line 1536
    .line 1537
    move-result-object v1
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_2

    .line 1538
    :try_start_5
    sget-object v5, Ljava/util/concurrent/TimeUnit;->SECONDS:Ljava/util/concurrent/TimeUnit;

    .line 1539
    .line 1540
    const-wide/16 v8, 0x3

    .line 1541
    .line 1542
    invoke-interface {v1, v8, v9, v5}, Ljava/util/concurrent/Future;->get(JLjava/util/concurrent/TimeUnit;)Ljava/lang/Object;

    .line 1543
    .line 1544
    .line 1545
    move-result-object v1

    .line 1546
    check-cast v1, Ljava/lang/Boolean;
    :try_end_5
    .catch Ljava/lang/Exception; {:try_start_5 .. :try_end_5} :catch_1

    .line 1547
    .line 1548
    :try_start_6
    sget-object v5, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    .line 1549
    .line 1550
    invoke-virtual {v5, v1}, Ljava/lang/Boolean;->equals(Ljava/lang/Object;)Z

    .line 1551
    .line 1552
    .line 1553
    move-result v1

    .line 1554
    iput-boolean v1, v2, Lnp;->g:Z

    .line 1555
    .line 1556
    goto :goto_16

    .line 1557
    :catch_1
    const/4 v10, 0x0

    .line 1558
    iput-boolean v10, v2, Lnp;->g:Z

    .line 1559
    .line 1560
    :goto_16
    iget-object v1, v2, Lnp;->h:Lfp;

    .line 1561
    .line 1562
    invoke-static {}, Ljava/lang/Thread;->getDefaultUncaughtExceptionHandler()Ljava/lang/Thread$UncaughtExceptionHandler;

    .line 1563
    .line 1564
    .line 1565
    move-result-object v5

    .line 1566
    iput-object v13, v1, Lfp;->o:Lip2;

    .line 1567
    .line 1568
    iget-object v8, v1, Lfp;->e:Lxa6;

    .line 1569
    .line 1570
    iget-object v8, v8, Lxa6;->b:Ljava/lang/Object;

    .line 1571
    .line 1572
    check-cast v8, Lyq;

    .line 1573
    .line 1574
    new-instance v9, Ll3;

    .line 1575
    .line 1576
    const/16 v10, 0xb

    .line 1577
    .line 1578
    invoke-direct {v9, v10, v1, v3}, Ll3;-><init>(ILjava/lang/Object;Ljava/lang/Object;)V

    .line 1579
    .line 1580
    .line 1581
    invoke-virtual {v8, v9}, Lyq;->b(Ljava/lang/Runnable;)Lcom/google/android/gms/tasks/Task;

    .line 1582
    .line 1583
    .line 1584
    new-instance v8, Lpo4;

    .line 1585
    .line 1586
    const/4 v9, 0x4

    .line 1587
    invoke-direct {v8, v1, v9}, Lpo4;-><init>(Ljava/lang/Object;I)V

    .line 1588
    .line 1589
    .line 1590
    new-instance v9, Lxq;

    .line 1591
    .line 1592
    iget-object v10, v1, Lfp;->j:Lpp;

    .line 1593
    .line 1594
    invoke-direct {v9, v8, v13, v5, v10}, Lxq;-><init>(Lpo4;Lip2;Ljava/lang/Thread$UncaughtExceptionHandler;Lpp;)V

    .line 1595
    .line 1596
    .line 1597
    iput-object v9, v1, Lfp;->n:Lxq;

    .line 1598
    .line 1599
    invoke-static {v9}, Ljava/lang/Thread;->setDefaultUncaughtExceptionHandler(Ljava/lang/Thread$UncaughtExceptionHandler;)V

    .line 1600
    .line 1601
    .line 1602
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    .line 1603
    .line 1604
    const/16 v5, 0x25

    .line 1605
    .line 1606
    if-lt v1, v5, :cond_20

    .line 1607
    .line 1608
    iget-object v1, v2, Lnp;->h:Lfp;

    .line 1609
    .line 1610
    invoke-virtual {v1, v3}, Lfp;->e(Ljava/lang/String;)V

    .line 1611
    .line 1612
    .line 1613
    goto :goto_17

    .line 1614
    :catch_2
    move-exception v0

    .line 1615
    goto :goto_18

    .line 1616
    :cond_20
    :goto_17
    if-eqz v0, :cond_23

    .line 1617
    .line 1618
    const-string v0, "android.permission.ACCESS_NETWORK_STATE"

    .line 1619
    .line 1620
    invoke-virtual {v6, v0}, Landroid/content/Context;->checkCallingOrSelfPermission(Ljava/lang/String;)I

    .line 1621
    .line 1622
    .line 1623
    move-result v0

    .line 1624
    if-nez v0, :cond_21

    .line 1625
    .line 1626
    const-string v0, "connectivity"

    .line 1627
    .line 1628
    invoke-virtual {v6, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    .line 1629
    .line 1630
    .line 1631
    move-result-object v0

    .line 1632
    check-cast v0, Landroid/net/ConnectivityManager;

    .line 1633
    .line 1634
    invoke-virtual {v0}, Landroid/net/ConnectivityManager;->getActiveNetworkInfo()Landroid/net/NetworkInfo;

    .line 1635
    .line 1636
    .line 1637
    move-result-object v0

    .line 1638
    if-eqz v0, :cond_23

    .line 1639
    .line 1640
    invoke-virtual {v0}, Landroid/net/NetworkInfo;->isConnectedOrConnecting()Z

    .line 1641
    .line 1642
    .line 1643
    move-result v0

    .line 1644
    if-eqz v0, :cond_23

    .line 1645
    .line 1646
    :cond_21
    const-string v0, "Crashlytics did not finish previous background initialization. Initializing synchronously."

    .line 1647
    .line 1648
    const/4 v1, 0x3

    .line 1649
    invoke-static {v4, v1}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 1650
    .line 1651
    .line 1652
    move-result v3

    .line 1653
    if-eqz v3, :cond_22

    .line 1654
    .line 1655
    const/4 v9, 0x0

    .line 1656
    invoke-static {v4, v0, v9}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 1657
    .line 1658
    .line 1659
    :cond_22
    invoke-virtual {v2, v13}, Lnp;->b(Lip2;)V
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_2

    .line 1660
    .line 1661
    .line 1662
    goto :goto_19

    .line 1663
    :cond_23
    const-string v0, "Successfully configured exception handler."

    .line 1664
    .line 1665
    const/4 v1, 0x3

    .line 1666
    invoke-static {v4, v1}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 1667
    .line 1668
    .line 1669
    move-result v3

    .line 1670
    if-eqz v3, :cond_24

    .line 1671
    .line 1672
    const/4 v9, 0x0

    .line 1673
    invoke-static {v4, v0, v9}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 1674
    .line 1675
    .line 1676
    :cond_24
    iget-object v0, v7, Lxa6;->b:Ljava/lang/Object;

    .line 1677
    .line 1678
    check-cast v0, Lyq;

    .line 1679
    .line 1680
    new-instance v1, Lgp;

    .line 1681
    .line 1682
    const/4 v10, 0x0

    .line 1683
    invoke-direct {v1, v2, v13, v10}, Lgp;-><init>(Lnp;Lip2;I)V

    .line 1684
    .line 1685
    .line 1686
    invoke-virtual {v0, v1}, Lyq;->b(Ljava/lang/Runnable;)Lcom/google/android/gms/tasks/Task;

    .line 1687
    .line 1688
    .line 1689
    goto :goto_19

    .line 1690
    :goto_18
    const-string v1, "Crashlytics was not started due to an exception during initialization"

    .line 1691
    .line 1692
    invoke-static {v4, v1, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 1693
    .line 1694
    .line 1695
    const/4 v9, 0x0

    .line 1696
    iput-object v9, v2, Lnp;->h:Lfp;

    .line 1697
    .line 1698
    :goto_19
    new-instance v15, Li50;

    .line 1699
    .line 1700
    invoke-direct {v15, v2}, Li50;-><init>(Lnp;)V

    .line 1701
    .line 1702
    .line 1703
    goto :goto_1a

    .line 1704
    :cond_25
    invoke-static {v4, v10}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1705
    .line 1706
    .line 1707
    const-string v0, ".     |  | "

    .line 1708
    .line 1709
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1710
    .line 1711
    .line 1712
    invoke-static {v4, v11}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1713
    .line 1714
    .line 1715
    invoke-static {v4, v11}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1716
    .line 1717
    .line 1718
    const-string v0, ".   \\ |  | /"

    .line 1719
    .line 1720
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1721
    .line 1722
    .line 1723
    const-string v0, ".    \\    /"

    .line 1724
    .line 1725
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1726
    .line 1727
    .line 1728
    const-string v0, ".     \\  /"

    .line 1729
    .line 1730
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1731
    .line 1732
    .line 1733
    const-string v0, ".      \\/"

    .line 1734
    .line 1735
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1736
    .line 1737
    .line 1738
    invoke-static {v4, v10}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1739
    .line 1740
    .line 1741
    invoke-static {v4, v5}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1742
    .line 1743
    .line 1744
    invoke-static {v4, v10}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1745
    .line 1746
    .line 1747
    const-string v0, ".      /\\"

    .line 1748
    .line 1749
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1750
    .line 1751
    .line 1752
    const-string v0, ".     /  \\"

    .line 1753
    .line 1754
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1755
    .line 1756
    .line 1757
    const-string v0, ".    /    \\"

    .line 1758
    .line 1759
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1760
    .line 1761
    .line 1762
    const-string v0, ".   / |  | \\"

    .line 1763
    .line 1764
    invoke-static {v4, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1765
    .line 1766
    .line 1767
    invoke-static {v4, v11}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1768
    .line 1769
    .line 1770
    invoke-static {v4, v11}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1771
    .line 1772
    .line 1773
    invoke-static {v4, v11}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1774
    .line 1775
    .line 1776
    invoke-static {v4, v10}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1777
    .line 1778
    .line 1779
    invoke-static {v5}, La1;->d(Ljava/lang/String;)V

    .line 1780
    .line 1781
    .line 1782
    const/4 v9, 0x0

    .line 1783
    return-object v9

    .line 1784
    :catchall_1
    move-exception v0

    .line 1785
    :try_start_7
    monitor-exit v7
    :try_end_7
    .catchall {:try_start_7 .. :try_end_7} :catchall_1

    .line 1786
    throw v0

    .line 1787
    :catch_3
    move-exception v0

    .line 1788
    const-string v1, "Error retrieving app package info."

    .line 1789
    .line 1790
    invoke-static {v4, v1, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 1791
    .line 1792
    .line 1793
    const/4 v15, 0x0

    .line 1794
    :goto_1a
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    .line 1795
    .line 1796
    .line 1797
    move-result-wide v0

    .line 1798
    sub-long v0, v0, v21

    .line 1799
    .line 1800
    const-wide/16 v2, 0x10

    .line 1801
    .line 1802
    cmp-long v2, v0, v2

    .line 1803
    .line 1804
    if-lez v2, :cond_26

    .line 1805
    .line 1806
    new-instance v2, Ljava/lang/StringBuilder;

    .line 1807
    .line 1808
    const-string v3, "Initializing Crashlytics blocked main for "

    .line 1809
    .line 1810
    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 1811
    .line 1812
    .line 1813
    invoke-virtual {v2, v0, v1}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    .line 1814
    .line 1815
    .line 1816
    const-string v0, " ms"

    .line 1817
    .line 1818
    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1819
    .line 1820
    .line 1821
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 1822
    .line 1823
    .line 1824
    move-result-object v0

    .line 1825
    const/4 v1, 0x3

    .line 1826
    invoke-static {v4, v1}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 1827
    .line 1828
    .line 1829
    move-result v1

    .line 1830
    if-eqz v1, :cond_26

    .line 1831
    .line 1832
    const/4 v9, 0x0

    .line 1833
    invoke-static {v4, v0, v9}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 1834
    .line 1835
    .line 1836
    :cond_26
    return-object v15

    .line 1837
    :goto_1b
    :try_start_8
    monitor-exit v2
    :try_end_8
    .catchall {:try_start_8 .. :try_end_8} :catchall_0

    .line 1838
    throw v0
.end method

.method public o(Ljava/lang/Object;)V
    .locals 9

    .line 1
    iget v0, p0, La4;->a:I

    .line 2
    .line 3
    const-string v1, ""

    .line 4
    .line 5
    const-string v2, "channel-error"

    .line 6
    .line 7
    sget-object v3, Ly02;->a:Ly02;

    .line 8
    .line 9
    const/4 v4, 0x2

    .line 10
    const/4 v5, 0x1

    .line 11
    const/4 v6, 0x0

    .line 12
    iget-object p0, p0, La4;->b:Ljava/lang/Object;

    .line 13
    .line 14
    sparse-switch v0, :sswitch_data_0

    .line 15
    .line 16
    .line 17
    check-cast p0, Ls4;

    .line 18
    .line 19
    instance-of v0, p1, Ljava/util/List;

    .line 20
    .line 21
    if-eqz v0, :cond_1

    .line 22
    .line 23
    check-cast p1, Ljava/util/List;

    .line 24
    .line 25
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 26
    .line 27
    .line 28
    move-result v0

    .line 29
    if-le v0, v5, :cond_0

    .line 30
    .line 31
    new-instance v0, Ln4;

    .line 32
    .line 33
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 34
    .line 35
    .line 36
    move-result-object v1

    .line 37
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 38
    .line 39
    .line 40
    check-cast v1, Ljava/lang/String;

    .line 41
    .line 42
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 43
    .line 44
    .line 45
    move-result-object v2

    .line 46
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 47
    .line 48
    .line 49
    check-cast v2, Ljava/lang/String;

    .line 50
    .line 51
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 52
    .line 53
    .line 54
    move-result-object p1

    .line 55
    check-cast p1, Ljava/lang/String;

    .line 56
    .line 57
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 58
    .line 59
    .line 60
    new-instance p1, Lvg1;

    .line 61
    .line 62
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 63
    .line 64
    .line 65
    new-instance v0, Lwg1;

    .line 66
    .line 67
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 68
    .line 69
    .line 70
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 71
    .line 72
    .line 73
    goto :goto_0

    .line 74
    :cond_0
    new-instance p1, Lwg1;

    .line 75
    .line 76
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 77
    .line 78
    .line 79
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 80
    .line 81
    .line 82
    goto :goto_0

    .line 83
    :cond_1
    new-instance p1, Ln4;

    .line 84
    .line 85
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.PrivateKey.pigeon_newInstance\'."

    .line 86
    .line 87
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 88
    .line 89
    .line 90
    new-instance v0, Lvg1;

    .line 91
    .line 92
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 93
    .line 94
    .line 95
    new-instance p1, Lwg1;

    .line 96
    .line 97
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 98
    .line 99
    .line 100
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 101
    .line 102
    .line 103
    :goto_0
    return-void

    .line 104
    :sswitch_0
    check-cast p0, Ls4;

    .line 105
    .line 106
    instance-of v0, p1, Ljava/util/List;

    .line 107
    .line 108
    if-eqz v0, :cond_3

    .line 109
    .line 110
    check-cast p1, Ljava/util/List;

    .line 111
    .line 112
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 113
    .line 114
    .line 115
    move-result v0

    .line 116
    if-le v0, v5, :cond_2

    .line 117
    .line 118
    new-instance v0, Ln4;

    .line 119
    .line 120
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 121
    .line 122
    .line 123
    move-result-object v1

    .line 124
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 125
    .line 126
    .line 127
    check-cast v1, Ljava/lang/String;

    .line 128
    .line 129
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 130
    .line 131
    .line 132
    move-result-object v2

    .line 133
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 134
    .line 135
    .line 136
    check-cast v2, Ljava/lang/String;

    .line 137
    .line 138
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 139
    .line 140
    .line 141
    move-result-object p1

    .line 142
    check-cast p1, Ljava/lang/String;

    .line 143
    .line 144
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 145
    .line 146
    .line 147
    new-instance p1, Lvg1;

    .line 148
    .line 149
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 150
    .line 151
    .line 152
    new-instance v0, Lwg1;

    .line 153
    .line 154
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 155
    .line 156
    .line 157
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 158
    .line 159
    .line 160
    goto :goto_1

    .line 161
    :cond_2
    new-instance p1, Lwg1;

    .line 162
    .line 163
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 164
    .line 165
    .line 166
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 167
    .line 168
    .line 169
    goto :goto_1

    .line 170
    :cond_3
    new-instance p1, Ln4;

    .line 171
    .line 172
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.PermissionRequest.pigeon_newInstance\'."

    .line 173
    .line 174
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 175
    .line 176
    .line 177
    new-instance v0, Lvg1;

    .line 178
    .line 179
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 180
    .line 181
    .line 182
    new-instance p1, Lwg1;

    .line 183
    .line 184
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 185
    .line 186
    .line 187
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 188
    .line 189
    .line 190
    :goto_1
    return-void

    .line 191
    :sswitch_1
    check-cast p0, Ls4;

    .line 192
    .line 193
    instance-of v0, p1, Ljava/util/List;

    .line 194
    .line 195
    if-eqz v0, :cond_5

    .line 196
    .line 197
    check-cast p1, Ljava/util/List;

    .line 198
    .line 199
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 200
    .line 201
    .line 202
    move-result v0

    .line 203
    if-le v0, v5, :cond_4

    .line 204
    .line 205
    new-instance v0, Ln4;

    .line 206
    .line 207
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 208
    .line 209
    .line 210
    move-result-object v1

    .line 211
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 212
    .line 213
    .line 214
    check-cast v1, Ljava/lang/String;

    .line 215
    .line 216
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 217
    .line 218
    .line 219
    move-result-object v2

    .line 220
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 221
    .line 222
    .line 223
    check-cast v2, Ljava/lang/String;

    .line 224
    .line 225
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 226
    .line 227
    .line 228
    move-result-object p1

    .line 229
    check-cast p1, Ljava/lang/String;

    .line 230
    .line 231
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 232
    .line 233
    .line 234
    new-instance p1, Lvg1;

    .line 235
    .line 236
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 237
    .line 238
    .line 239
    new-instance v0, Lwg1;

    .line 240
    .line 241
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 242
    .line 243
    .line 244
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 245
    .line 246
    .line 247
    goto :goto_2

    .line 248
    :cond_4
    new-instance p1, Lwg1;

    .line 249
    .line 250
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 251
    .line 252
    .line 253
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 254
    .line 255
    .line 256
    goto :goto_2

    .line 257
    :cond_5
    new-instance p1, Ln4;

    .line 258
    .line 259
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.HttpAuthHandler.pigeon_newInstance\'."

    .line 260
    .line 261
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 262
    .line 263
    .line 264
    new-instance v0, Lvg1;

    .line 265
    .line 266
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 267
    .line 268
    .line 269
    new-instance p1, Lwg1;

    .line 270
    .line 271
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 272
    .line 273
    .line 274
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 275
    .line 276
    .line 277
    :goto_2
    return-void

    .line 278
    :sswitch_2
    check-cast p0, Ls4;

    .line 279
    .line 280
    instance-of v0, p1, Ljava/util/List;

    .line 281
    .line 282
    if-eqz v0, :cond_7

    .line 283
    .line 284
    check-cast p1, Ljava/util/List;

    .line 285
    .line 286
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 287
    .line 288
    .line 289
    move-result v0

    .line 290
    if-le v0, v5, :cond_6

    .line 291
    .line 292
    new-instance v0, Ln4;

    .line 293
    .line 294
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 295
    .line 296
    .line 297
    move-result-object v1

    .line 298
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 299
    .line 300
    .line 301
    check-cast v1, Ljava/lang/String;

    .line 302
    .line 303
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 304
    .line 305
    .line 306
    move-result-object v2

    .line 307
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 308
    .line 309
    .line 310
    check-cast v2, Ljava/lang/String;

    .line 311
    .line 312
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 313
    .line 314
    .line 315
    move-result-object p1

    .line 316
    check-cast p1, Ljava/lang/String;

    .line 317
    .line 318
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 319
    .line 320
    .line 321
    new-instance p1, Lvg1;

    .line 322
    .line 323
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 324
    .line 325
    .line 326
    new-instance v0, Lwg1;

    .line 327
    .line 328
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 329
    .line 330
    .line 331
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 332
    .line 333
    .line 334
    goto :goto_3

    .line 335
    :cond_6
    new-instance p1, Lwg1;

    .line 336
    .line 337
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 338
    .line 339
    .line 340
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 341
    .line 342
    .line 343
    goto :goto_3

    .line 344
    :cond_7
    new-instance p1, Ln4;

    .line 345
    .line 346
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.GeolocationPermissionsCallback.pigeon_newInstance\'."

    .line 347
    .line 348
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 349
    .line 350
    .line 351
    new-instance v0, Lvg1;

    .line 352
    .line 353
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 354
    .line 355
    .line 356
    new-instance p1, Lwg1;

    .line 357
    .line 358
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 359
    .line 360
    .line 361
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 362
    .line 363
    .line 364
    :goto_3
    return-void

    .line 365
    :sswitch_3
    check-cast p0, Ls4;

    .line 366
    .line 367
    instance-of v0, p1, Ljava/util/List;

    .line 368
    .line 369
    if-eqz v0, :cond_9

    .line 370
    .line 371
    check-cast p1, Ljava/util/List;

    .line 372
    .line 373
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 374
    .line 375
    .line 376
    move-result v0

    .line 377
    if-le v0, v5, :cond_8

    .line 378
    .line 379
    new-instance v0, Ln4;

    .line 380
    .line 381
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 382
    .line 383
    .line 384
    move-result-object v1

    .line 385
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 386
    .line 387
    .line 388
    check-cast v1, Ljava/lang/String;

    .line 389
    .line 390
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 391
    .line 392
    .line 393
    move-result-object v2

    .line 394
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 395
    .line 396
    .line 397
    check-cast v2, Ljava/lang/String;

    .line 398
    .line 399
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 400
    .line 401
    .line 402
    move-result-object p1

    .line 403
    check-cast p1, Ljava/lang/String;

    .line 404
    .line 405
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 406
    .line 407
    .line 408
    new-instance p1, Lvg1;

    .line 409
    .line 410
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 411
    .line 412
    .line 413
    new-instance v0, Lwg1;

    .line 414
    .line 415
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 416
    .line 417
    .line 418
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 419
    .line 420
    .line 421
    goto :goto_4

    .line 422
    :cond_8
    new-instance p1, Lwg1;

    .line 423
    .line 424
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 425
    .line 426
    .line 427
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 428
    .line 429
    .line 430
    goto :goto_4

    .line 431
    :cond_9
    new-instance p1, Ln4;

    .line 432
    .line 433
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.FlutterAssetManager.pigeon_newInstance\'."

    .line 434
    .line 435
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 436
    .line 437
    .line 438
    new-instance v0, Lvg1;

    .line 439
    .line 440
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 441
    .line 442
    .line 443
    new-instance p1, Lwg1;

    .line 444
    .line 445
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 446
    .line 447
    .line 448
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 449
    .line 450
    .line 451
    :goto_4
    return-void

    .line 452
    :sswitch_4
    check-cast p0, Ls4;

    .line 453
    .line 454
    instance-of v0, p1, Ljava/util/List;

    .line 455
    .line 456
    if-eqz v0, :cond_b

    .line 457
    .line 458
    check-cast p1, Ljava/util/List;

    .line 459
    .line 460
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 461
    .line 462
    .line 463
    move-result v0

    .line 464
    if-le v0, v5, :cond_a

    .line 465
    .line 466
    new-instance v0, Ln4;

    .line 467
    .line 468
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 469
    .line 470
    .line 471
    move-result-object v1

    .line 472
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 473
    .line 474
    .line 475
    check-cast v1, Ljava/lang/String;

    .line 476
    .line 477
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 478
    .line 479
    .line 480
    move-result-object v2

    .line 481
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 482
    .line 483
    .line 484
    check-cast v2, Ljava/lang/String;

    .line 485
    .line 486
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 487
    .line 488
    .line 489
    move-result-object p1

    .line 490
    check-cast p1, Ljava/lang/String;

    .line 491
    .line 492
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 493
    .line 494
    .line 495
    new-instance p1, Lvg1;

    .line 496
    .line 497
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 498
    .line 499
    .line 500
    new-instance v0, Lwg1;

    .line 501
    .line 502
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 503
    .line 504
    .line 505
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 506
    .line 507
    .line 508
    goto :goto_5

    .line 509
    :cond_a
    new-instance p1, Lwg1;

    .line 510
    .line 511
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 512
    .line 513
    .line 514
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 515
    .line 516
    .line 517
    goto :goto_5

    .line 518
    :cond_b
    new-instance p1, Ln4;

    .line 519
    .line 520
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.FileChooserParams.pigeon_newInstance\'."

    .line 521
    .line 522
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 523
    .line 524
    .line 525
    new-instance v0, Lvg1;

    .line 526
    .line 527
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 528
    .line 529
    .line 530
    new-instance p1, Lwg1;

    .line 531
    .line 532
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 533
    .line 534
    .line 535
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 536
    .line 537
    .line 538
    :goto_5
    return-void

    .line 539
    :sswitch_5
    check-cast p0, Ls4;

    .line 540
    .line 541
    instance-of v0, p1, Ljava/util/List;

    .line 542
    .line 543
    if-eqz v0, :cond_d

    .line 544
    .line 545
    check-cast p1, Ljava/util/List;

    .line 546
    .line 547
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 548
    .line 549
    .line 550
    move-result v0

    .line 551
    if-le v0, v5, :cond_c

    .line 552
    .line 553
    new-instance v0, Ln4;

    .line 554
    .line 555
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 556
    .line 557
    .line 558
    move-result-object v1

    .line 559
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 560
    .line 561
    .line 562
    check-cast v1, Ljava/lang/String;

    .line 563
    .line 564
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 565
    .line 566
    .line 567
    move-result-object v2

    .line 568
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 569
    .line 570
    .line 571
    check-cast v2, Ljava/lang/String;

    .line 572
    .line 573
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 574
    .line 575
    .line 576
    move-result-object p1

    .line 577
    check-cast p1, Ljava/lang/String;

    .line 578
    .line 579
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 580
    .line 581
    .line 582
    new-instance p1, Lvg1;

    .line 583
    .line 584
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 585
    .line 586
    .line 587
    new-instance v0, Lwg1;

    .line 588
    .line 589
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 590
    .line 591
    .line 592
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 593
    .line 594
    .line 595
    goto :goto_6

    .line 596
    :cond_c
    new-instance p1, Lwg1;

    .line 597
    .line 598
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 599
    .line 600
    .line 601
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 602
    .line 603
    .line 604
    goto :goto_6

    .line 605
    :cond_d
    new-instance p1, Ln4;

    .line 606
    .line 607
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.CustomViewCallback.pigeon_newInstance\'."

    .line 608
    .line 609
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 610
    .line 611
    .line 612
    new-instance v0, Lvg1;

    .line 613
    .line 614
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 615
    .line 616
    .line 617
    new-instance p1, Lwg1;

    .line 618
    .line 619
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 620
    .line 621
    .line 622
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 623
    .line 624
    .line 625
    :goto_6
    return-void

    .line 626
    :sswitch_6
    check-cast p0, Ls4;

    .line 627
    .line 628
    instance-of v0, p1, Ljava/util/List;

    .line 629
    .line 630
    if-eqz v0, :cond_f

    .line 631
    .line 632
    check-cast p1, Ljava/util/List;

    .line 633
    .line 634
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 635
    .line 636
    .line 637
    move-result v0

    .line 638
    if-le v0, v5, :cond_e

    .line 639
    .line 640
    new-instance v0, Ln4;

    .line 641
    .line 642
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 643
    .line 644
    .line 645
    move-result-object v1

    .line 646
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 647
    .line 648
    .line 649
    check-cast v1, Ljava/lang/String;

    .line 650
    .line 651
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 652
    .line 653
    .line 654
    move-result-object v2

    .line 655
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 656
    .line 657
    .line 658
    check-cast v2, Ljava/lang/String;

    .line 659
    .line 660
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 661
    .line 662
    .line 663
    move-result-object p1

    .line 664
    check-cast p1, Ljava/lang/String;

    .line 665
    .line 666
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 667
    .line 668
    .line 669
    new-instance p1, Lvg1;

    .line 670
    .line 671
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 672
    .line 673
    .line 674
    new-instance v0, Lwg1;

    .line 675
    .line 676
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 677
    .line 678
    .line 679
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 680
    .line 681
    .line 682
    goto :goto_7

    .line 683
    :cond_e
    new-instance p1, Lwg1;

    .line 684
    .line 685
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 686
    .line 687
    .line 688
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 689
    .line 690
    .line 691
    goto :goto_7

    .line 692
    :cond_f
    new-instance p1, Ln4;

    .line 693
    .line 694
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.CookieManager.pigeon_newInstance\'."

    .line 695
    .line 696
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 697
    .line 698
    .line 699
    new-instance v0, Lvg1;

    .line 700
    .line 701
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 702
    .line 703
    .line 704
    new-instance p1, Lwg1;

    .line 705
    .line 706
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 707
    .line 708
    .line 709
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 710
    .line 711
    .line 712
    :goto_7
    return-void

    .line 713
    :sswitch_7
    check-cast p0, Ls4;

    .line 714
    .line 715
    instance-of v0, p1, Ljava/util/List;

    .line 716
    .line 717
    if-eqz v0, :cond_11

    .line 718
    .line 719
    check-cast p1, Ljava/util/List;

    .line 720
    .line 721
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 722
    .line 723
    .line 724
    move-result v0

    .line 725
    if-le v0, v5, :cond_10

    .line 726
    .line 727
    new-instance v0, Ln4;

    .line 728
    .line 729
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 730
    .line 731
    .line 732
    move-result-object v1

    .line 733
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 734
    .line 735
    .line 736
    check-cast v1, Ljava/lang/String;

    .line 737
    .line 738
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 739
    .line 740
    .line 741
    move-result-object v2

    .line 742
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 743
    .line 744
    .line 745
    check-cast v2, Ljava/lang/String;

    .line 746
    .line 747
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 748
    .line 749
    .line 750
    move-result-object p1

    .line 751
    check-cast p1, Ljava/lang/String;

    .line 752
    .line 753
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 754
    .line 755
    .line 756
    new-instance p1, Lvg1;

    .line 757
    .line 758
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 759
    .line 760
    .line 761
    new-instance v0, Lwg1;

    .line 762
    .line 763
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 764
    .line 765
    .line 766
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 767
    .line 768
    .line 769
    goto :goto_8

    .line 770
    :cond_10
    new-instance p1, Lwg1;

    .line 771
    .line 772
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 773
    .line 774
    .line 775
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 776
    .line 777
    .line 778
    goto :goto_8

    .line 779
    :cond_11
    new-instance p1, Ln4;

    .line 780
    .line 781
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.ConsoleMessage.pigeon_newInstance\'."

    .line 782
    .line 783
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 784
    .line 785
    .line 786
    new-instance v0, Lvg1;

    .line 787
    .line 788
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 789
    .line 790
    .line 791
    new-instance p1, Lwg1;

    .line 792
    .line 793
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 794
    .line 795
    .line 796
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 797
    .line 798
    .line 799
    :goto_8
    return-void

    .line 800
    :sswitch_8
    check-cast p0, Ls4;

    .line 801
    .line 802
    instance-of v0, p1, Ljava/util/List;

    .line 803
    .line 804
    if-eqz v0, :cond_13

    .line 805
    .line 806
    check-cast p1, Ljava/util/List;

    .line 807
    .line 808
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 809
    .line 810
    .line 811
    move-result v0

    .line 812
    if-le v0, v5, :cond_12

    .line 813
    .line 814
    new-instance v0, Ln4;

    .line 815
    .line 816
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 817
    .line 818
    .line 819
    move-result-object v1

    .line 820
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 821
    .line 822
    .line 823
    check-cast v1, Ljava/lang/String;

    .line 824
    .line 825
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 826
    .line 827
    .line 828
    move-result-object v2

    .line 829
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 830
    .line 831
    .line 832
    check-cast v2, Ljava/lang/String;

    .line 833
    .line 834
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 835
    .line 836
    .line 837
    move-result-object p1

    .line 838
    check-cast p1, Ljava/lang/String;

    .line 839
    .line 840
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 841
    .line 842
    .line 843
    new-instance p1, Lvg1;

    .line 844
    .line 845
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 846
    .line 847
    .line 848
    new-instance v0, Lwg1;

    .line 849
    .line 850
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 851
    .line 852
    .line 853
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 854
    .line 855
    .line 856
    goto :goto_9

    .line 857
    :cond_12
    new-instance p1, Lwg1;

    .line 858
    .line 859
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 860
    .line 861
    .line 862
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 863
    .line 864
    .line 865
    goto :goto_9

    .line 866
    :cond_13
    new-instance p1, Ln4;

    .line 867
    .line 868
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.ClientCertRequest.pigeon_newInstance\'."

    .line 869
    .line 870
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 871
    .line 872
    .line 873
    new-instance v0, Lvg1;

    .line 874
    .line 875
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 876
    .line 877
    .line 878
    new-instance p1, Lwg1;

    .line 879
    .line 880
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 881
    .line 882
    .line 883
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 884
    .line 885
    .line 886
    :goto_9
    return-void

    .line 887
    :sswitch_9
    check-cast p0, Ls4;

    .line 888
    .line 889
    instance-of v0, p1, Ljava/util/List;

    .line 890
    .line 891
    if-eqz v0, :cond_15

    .line 892
    .line 893
    check-cast p1, Ljava/util/List;

    .line 894
    .line 895
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 896
    .line 897
    .line 898
    move-result v0

    .line 899
    if-le v0, v5, :cond_14

    .line 900
    .line 901
    new-instance v0, Ln4;

    .line 902
    .line 903
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 904
    .line 905
    .line 906
    move-result-object v1

    .line 907
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 908
    .line 909
    .line 910
    check-cast v1, Ljava/lang/String;

    .line 911
    .line 912
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 913
    .line 914
    .line 915
    move-result-object v2

    .line 916
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 917
    .line 918
    .line 919
    check-cast v2, Ljava/lang/String;

    .line 920
    .line 921
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 922
    .line 923
    .line 924
    move-result-object p1

    .line 925
    check-cast p1, Ljava/lang/String;

    .line 926
    .line 927
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 928
    .line 929
    .line 930
    new-instance p1, Lvg1;

    .line 931
    .line 932
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 933
    .line 934
    .line 935
    new-instance v0, Lwg1;

    .line 936
    .line 937
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 938
    .line 939
    .line 940
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 941
    .line 942
    .line 943
    goto :goto_a

    .line 944
    :cond_14
    new-instance p1, Lwg1;

    .line 945
    .line 946
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 947
    .line 948
    .line 949
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 950
    .line 951
    .line 952
    goto :goto_a

    .line 953
    :cond_15
    new-instance p1, Ln4;

    .line 954
    .line 955
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.Certificate.pigeon_newInstance\'."

    .line 956
    .line 957
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 958
    .line 959
    .line 960
    new-instance v0, Lvg1;

    .line 961
    .line 962
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 963
    .line 964
    .line 965
    new-instance p1, Lwg1;

    .line 966
    .line 967
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 968
    .line 969
    .line 970
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 971
    .line 972
    .line 973
    :goto_a
    return-void

    .line 974
    :sswitch_a
    check-cast p0, Ls4;

    .line 975
    .line 976
    instance-of v0, p1, Ljava/util/List;

    .line 977
    .line 978
    if-eqz v0, :cond_17

    .line 979
    .line 980
    check-cast p1, Ljava/util/List;

    .line 981
    .line 982
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 983
    .line 984
    .line 985
    move-result v0

    .line 986
    if-le v0, v5, :cond_16

    .line 987
    .line 988
    new-instance v0, Ln4;

    .line 989
    .line 990
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 991
    .line 992
    .line 993
    move-result-object v1

    .line 994
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 995
    .line 996
    .line 997
    check-cast v1, Ljava/lang/String;

    .line 998
    .line 999
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 1000
    .line 1001
    .line 1002
    move-result-object v2

    .line 1003
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 1004
    .line 1005
    .line 1006
    check-cast v2, Ljava/lang/String;

    .line 1007
    .line 1008
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 1009
    .line 1010
    .line 1011
    move-result-object p1

    .line 1012
    check-cast p1, Ljava/lang/String;

    .line 1013
    .line 1014
    invoke-direct {v0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1015
    .line 1016
    .line 1017
    new-instance p1, Lvg1;

    .line 1018
    .line 1019
    invoke-direct {p1, v0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 1020
    .line 1021
    .line 1022
    new-instance v0, Lwg1;

    .line 1023
    .line 1024
    invoke-direct {v0, p1}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 1025
    .line 1026
    .line 1027
    invoke-virtual {p0, v0}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 1028
    .line 1029
    .line 1030
    goto :goto_b

    .line 1031
    :cond_16
    new-instance p1, Lwg1;

    .line 1032
    .line 1033
    invoke-direct {p1, v3}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 1034
    .line 1035
    .line 1036
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 1037
    .line 1038
    .line 1039
    goto :goto_b

    .line 1040
    :cond_17
    new-instance p1, Ln4;

    .line 1041
    .line 1042
    const-string v0, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.AndroidMessage.pigeon_newInstance\'."

    .line 1043
    .line 1044
    invoke-direct {p1, v2, v0, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1045
    .line 1046
    .line 1047
    new-instance v0, Lvg1;

    .line 1048
    .line 1049
    invoke-direct {v0, p1}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 1050
    .line 1051
    .line 1052
    new-instance p1, Lwg1;

    .line 1053
    .line 1054
    invoke-direct {p1, v0}, Lwg1;-><init>(Ljava/lang/Object;)V

    .line 1055
    .line 1056
    .line 1057
    invoke-virtual {p0, p1}, Ls4;->invoke(Ljava/lang/Object;)Ljava/lang/Object;

    .line 1058
    .line 1059
    .line 1060
    :goto_b
    return-void

    .line 1061
    :sswitch_b
    check-cast p0, La4;

    .line 1062
    .line 1063
    if-eqz p1, :cond_18

    .line 1064
    .line 1065
    :try_start_0
    check-cast p1, Lorg/json/JSONObject;

    .line 1066
    .line 1067
    const-string v0, "handled"

    .line 1068
    .line 1069
    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->getBoolean(Ljava/lang/String;)Z

    .line 1070
    .line 1071
    .line 1072
    move-result v6
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 1073
    goto :goto_c

    .line 1074
    :catch_0
    move-exception p1

    .line 1075
    new-instance v0, Ljava/lang/StringBuilder;

    .line 1076
    .line 1077
    const-string v1, "Unable to unpack JSON message: "

    .line 1078
    .line 1079
    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 1080
    .line 1081
    .line 1082
    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    .line 1083
    .line 1084
    .line 1085
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 1086
    .line 1087
    .line 1088
    move-result-object p1

    .line 1089
    const-string v0, "KeyEventChannel"

    .line 1090
    .line 1091
    invoke-static {v0, p1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1092
    .line 1093
    .line 1094
    :cond_18
    :goto_c
    iget-object p0, p0, La4;->b:Ljava/lang/Object;

    .line 1095
    .line 1096
    check-cast p0, Luk;

    .line 1097
    .line 1098
    invoke-virtual {p0, v6}, Luk;->f(Z)V

    .line 1099
    .line 1100
    .line 1101
    return-void

    .line 1102
    :sswitch_c
    check-cast p0, Lu4;

    .line 1103
    .line 1104
    iget-wide v7, p0, Lu4;->b:J

    .line 1105
    .line 1106
    instance-of p0, p1, Ljava/util/List;

    .line 1107
    .line 1108
    const-string v0, "Failed to remove Dart strong reference with identifier: "

    .line 1109
    .line 1110
    const-string v3, "PigeonProxyApiRegistrar"

    .line 1111
    .line 1112
    if-eqz p0, :cond_19

    .line 1113
    .line 1114
    check-cast p1, Ljava/util/List;

    .line 1115
    .line 1116
    invoke-interface {p1}, Ljava/util/List;->size()I

    .line 1117
    .line 1118
    .line 1119
    move-result p0

    .line 1120
    if-le p0, v5, :cond_1a

    .line 1121
    .line 1122
    new-instance p0, Ln4;

    .line 1123
    .line 1124
    invoke-interface {p1, v6}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 1125
    .line 1126
    .line 1127
    move-result-object v1

    .line 1128
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 1129
    .line 1130
    .line 1131
    check-cast v1, Ljava/lang/String;

    .line 1132
    .line 1133
    invoke-interface {p1, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 1134
    .line 1135
    .line 1136
    move-result-object v2

    .line 1137
    invoke-virtual {v2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 1138
    .line 1139
    .line 1140
    check-cast v2, Ljava/lang/String;

    .line 1141
    .line 1142
    invoke-interface {p1, v4}, Ljava/util/List;->get(I)Ljava/lang/Object;

    .line 1143
    .line 1144
    .line 1145
    move-result-object p1

    .line 1146
    check-cast p1, Ljava/lang/String;

    .line 1147
    .line 1148
    invoke-direct {p0, v1, v2, p1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1149
    .line 1150
    .line 1151
    new-instance p1, Lvg1;

    .line 1152
    .line 1153
    invoke-direct {p1, p0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 1154
    .line 1155
    .line 1156
    new-instance p0, Ljava/lang/StringBuilder;

    .line 1157
    .line 1158
    invoke-direct {p0, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 1159
    .line 1160
    .line 1161
    invoke-virtual {p0, v7, v8}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    .line 1162
    .line 1163
    .line 1164
    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 1165
    .line 1166
    .line 1167
    move-result-object p0

    .line 1168
    invoke-static {v3, p0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1169
    .line 1170
    .line 1171
    goto :goto_d

    .line 1172
    :cond_19
    new-instance p0, Ln4;

    .line 1173
    .line 1174
    const-string p1, "Unable to establish connection on channel: \'dev.flutter.pigeon.webview_flutter_android.PigeonInternalInstanceManager.removeStrongReference\'."

    .line 1175
    .line 1176
    invoke-direct {p0, v2, p1, v1}, Ln4;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1177
    .line 1178
    .line 1179
    new-instance p1, Lvg1;

    .line 1180
    .line 1181
    invoke-direct {p1, p0}, Lvg1;-><init>(Ljava/lang/Throwable;)V

    .line 1182
    .line 1183
    .line 1184
    new-instance p0, Ljava/lang/StringBuilder;

    .line 1185
    .line 1186
    invoke-direct {p0, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 1187
    .line 1188
    .line 1189
    invoke-virtual {p0, v7, v8}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    .line 1190
    .line 1191
    .line 1192
    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 1193
    .line 1194
    .line 1195
    move-result-object p0

    .line 1196
    invoke-static {v3, p0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1197
    .line 1198
    .line 1199
    :cond_1a
    :goto_d
    return-void

    .line 1200
    nop

    .line 1201
    :sswitch_data_0
    .sparse-switch
        0x2 -> :sswitch_c
        0xe -> :sswitch_b
        0x10 -> :sswitch_a
        0x11 -> :sswitch_9
        0x12 -> :sswitch_8
        0x13 -> :sswitch_7
        0x14 -> :sswitch_6
        0x15 -> :sswitch_5
        0x17 -> :sswitch_4
        0x18 -> :sswitch_3
        0x19 -> :sswitch_2
        0x1a -> :sswitch_1
        0x1c -> :sswitch_0
    .end sparse-switch
.end method

.method public then(Lcom/google/android/gms/tasks/Task;)Ljava/lang/Object;
    .locals 0

    .line 1
    iget p1, p0, La4;->a:I

    .line 2
    .line 3
    iget-object p0, p0, La4;->b:Ljava/lang/Object;

    .line 4
    .line 5
    packed-switch p1, :pswitch_data_0

    .line 6
    .line 7
    .line 8
    check-cast p0, Ljava/lang/Runnable;

    .line 9
    .line 10
    invoke-interface {p0}, Ljava/lang/Runnable;->run()V

    .line 11
    .line 12
    .line 13
    const/4 p0, 0x0

    .line 14
    invoke-static {p0}, Lcom/google/android/gms/tasks/Tasks;->forResult(Ljava/lang/Object;)Lcom/google/android/gms/tasks/Task;

    .line 15
    .line 16
    .line 17
    move-result-object p0

    .line 18
    return-object p0

    .line 19
    :pswitch_0
    check-cast p0, Ljava/util/concurrent/Callable;

    .line 20
    .line 21
    invoke-interface {p0}, Ljava/util/concurrent/Callable;->call()Ljava/lang/Object;

    .line 22
    .line 23
    .line 24
    move-result-object p0

    .line 25
    check-cast p0, Lcom/google/android/gms/tasks/Task;

    .line 26
    .line 27
    return-object p0

    .line 28
    nop

    .line 29
    :pswitch_data_0
    .packed-switch 0x8
        :pswitch_0
    .end packed-switch
.end method
