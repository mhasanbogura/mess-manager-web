.class public final La23;
.super Ljava/lang/Object;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"

# interfaces
.implements Lv13;


# static fields
.field public static final l:[F


# instance fields
.field public a:J

.field public b:Z

.field public c:J

.field public final d:Ljava/lang/Object;

.field public final e:Ljava/lang/Object;

.field public final f:Ljava/lang/Object;

.field public final g:Ljava/lang/Object;

.field public final h:Ljava/lang/Object;

.field public i:Ljava/lang/Object;

.field public j:Ljava/lang/Object;

.field public k:Ljava/lang/Object;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 1
    const/4 v0, 0x7

    .line 2
    new-array v0, v0, [F

    .line 3
    .line 4
    fill-array-data v0, :array_0

    .line 5
    .line 6
    .line 7
    sput-object v0, La23;->l:[F

    .line 8
    .line 9
    return-void

    .line 10
    nop

    .line 11
    :array_0
    .array-data 4
        0x3f800000    # 1.0f
        0x3f800000    # 1.0f
        0x3f8ba2e9
        0x3f68ba2f
        0x3fba2e8c
        0x3f9b26ca
        0x3f800000    # 1.0f
    .end array-data
.end method

.method public constructor <init>(Lph1;)V
    .locals 3

    .line 1
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 2
    .line 3
    .line 4
    iput-object p1, p0, La23;->d:Ljava/lang/Object;

    .line 5
    .line 6
    new-instance p1, Ljava/util/WeakHashMap;

    .line 7
    .line 8
    invoke-direct {p1}, Ljava/util/WeakHashMap;-><init>()V

    .line 9
    .line 10
    .line 11
    iput-object p1, p0, La23;->e:Ljava/lang/Object;

    .line 12
    .line 13
    new-instance p1, Ljava/util/HashMap;

    .line 14
    .line 15
    invoke-direct {p1}, Ljava/util/HashMap;-><init>()V

    .line 16
    .line 17
    .line 18
    iput-object p1, p0, La23;->f:Ljava/lang/Object;

    .line 19
    .line 20
    new-instance p1, Ljava/util/HashMap;

    .line 21
    .line 22
    invoke-direct {p1}, Ljava/util/HashMap;-><init>()V

    .line 23
    .line 24
    .line 25
    iput-object p1, p0, La23;->g:Ljava/lang/Object;

    .line 26
    .line 27
    new-instance p1, Ljava/lang/ref/ReferenceQueue;

    .line 28
    .line 29
    invoke-direct {p1}, Ljava/lang/ref/ReferenceQueue;-><init>()V

    .line 30
    .line 31
    .line 32
    iput-object p1, p0, La23;->h:Ljava/lang/Object;

    .line 33
    .line 34
    new-instance p1, Ljava/util/HashMap;

    .line 35
    .line 36
    invoke-direct {p1}, Ljava/util/HashMap;-><init>()V

    .line 37
    .line 38
    .line 39
    iput-object p1, p0, La23;->i:Ljava/lang/Object;

    .line 40
    .line 41
    new-instance p1, Landroid/os/Handler;

    .line 42
    .line 43
    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    .line 44
    .line 45
    .line 46
    move-result-object v0

    .line 47
    invoke-direct {p1, v0}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    .line 48
    .line 49
    .line 50
    iput-object p1, p0, La23;->j:Ljava/lang/Object;

    .line 51
    .line 52
    new-instance v0, Lo4;

    .line 53
    .line 54
    const/4 v1, 0x0

    .line 55
    invoke-direct {v0, p0, v1}, Lo4;-><init>(Ljava/lang/Object;I)V

    .line 56
    .line 57
    .line 58
    iput-object v0, p0, La23;->k:Ljava/lang/Object;

    .line 59
    .line 60
    const-wide/32 v1, 0x10000

    .line 61
    .line 62
    .line 63
    iput-wide v1, p0, La23;->a:J

    .line 64
    .line 65
    const-wide/16 v1, 0xbb8

    .line 66
    .line 67
    iput-wide v1, p0, La23;->c:J

    .line 68
    .line 69
    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 70
    .line 71
    .line 72
    return-void
.end method

.method public constructor <init>(Lzc2;)V
    .locals 2

    .line 73
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, La23;->d:Ljava/lang/Object;

    const/4 p1, 0x4

    new-array p1, p1, [Z

    iput-object p1, p0, La23;->f:Ljava/lang/Object;

    new-instance p1, Ly13;

    .line 74
    invoke-direct {p1}, Ljava/lang/Object;-><init>()V

    const/16 v0, 0x80

    new-array v0, v0, [B

    iput-object v0, p1, Ly13;->e:[B

    .line 75
    iput-object p1, p0, La23;->g:Ljava/lang/Object;

    const-wide v0, -0x7fffffffffffffffL    # -4.9E-324

    iput-wide v0, p0, La23;->c:J

    new-instance p1, Li23;

    const/16 v0, 0xb2

    .line 76
    invoke-direct {p1, v0}, Li23;-><init>(I)V

    iput-object p1, p0, La23;->h:Ljava/lang/Object;

    .line 77
    new-instance p1, Lpp4;

    invoke-direct {p1}, Lpp4;-><init>()V

    iput-object p1, p0, La23;->e:Ljava/lang/Object;

    return-void
.end method


# virtual methods
.method public a(Z)V
    .locals 4

    .line 1
    iget-object v0, p0, La23;->i:Ljava/lang/Object;

    .line 2
    .line 3
    check-cast v0, Lz13;

    .line 4
    .line 5
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 6
    .line 7
    .line 8
    if-eqz p1, :cond_0

    .line 9
    .line 10
    iget-wide v1, p0, La23;->a:J

    .line 11
    .line 12
    iget-boolean p1, p0, La23;->b:Z

    .line 13
    .line 14
    const/4 v3, 0x0

    .line 15
    invoke-virtual {v0, v3, v1, v2, p1}, Lz13;->b(IJZ)V

    .line 16
    .line 17
    .line 18
    iget-object p0, p0, La23;->i:Ljava/lang/Object;

    .line 19
    .line 20
    check-cast p0, Lz13;

    .line 21
    .line 22
    iput-boolean v3, p0, Lz13;->b:Z

    .line 23
    .line 24
    iput-boolean v3, p0, Lz13;->c:Z

    .line 25
    .line 26
    iput-boolean v3, p0, Lz13;->d:Z

    .line 27
    .line 28
    const/4 p1, -0x1

    .line 29
    iput p1, p0, Lz13;->e:I

    .line 30
    .line 31
    :cond_0
    return-void
.end method

.method public b(IJ)V
    .locals 0

    .line 1
    iput-wide p2, p0, La23;->c:J

    .line 2
    .line 3
    return-void
.end method

.method public c(Lpp4;)V
    .locals 20

    .line 1
    move-object/from16 v0, p0

    .line 2
    .line 3
    move-object/from16 v1, p1

    .line 4
    .line 5
    iget-object v2, v0, La23;->h:Ljava/lang/Object;

    .line 6
    .line 7
    check-cast v2, Li23;

    .line 8
    .line 9
    iget-object v3, v0, La23;->g:Ljava/lang/Object;

    .line 10
    .line 11
    check-cast v3, Ly13;

    .line 12
    .line 13
    iget-object v4, v0, La23;->i:Ljava/lang/Object;

    .line 14
    .line 15
    check-cast v4, Lz13;

    .line 16
    .line 17
    invoke-virtual {v4}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 18
    .line 19
    .line 20
    iget-object v4, v0, La23;->k:Ljava/lang/Object;

    .line 21
    .line 22
    check-cast v4, Llq2;

    .line 23
    .line 24
    invoke-virtual {v4}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 25
    .line 26
    .line 27
    iget v4, v1, Lpp4;->b:I

    .line 28
    .line 29
    iget v5, v1, Lpp4;->c:I

    .line 30
    .line 31
    iget-object v6, v1, Lpp4;->a:[B

    .line 32
    .line 33
    iget-wide v7, v0, La23;->a:J

    .line 34
    .line 35
    invoke-virtual {v1}, Lpp4;->B()I

    .line 36
    .line 37
    .line 38
    move-result v9

    .line 39
    int-to-long v9, v9

    .line 40
    add-long/2addr v7, v9

    .line 41
    iput-wide v7, v0, La23;->a:J

    .line 42
    .line 43
    iget-object v7, v0, La23;->k:Ljava/lang/Object;

    .line 44
    .line 45
    check-cast v7, Llq2;

    .line 46
    .line 47
    invoke-virtual {v1}, Lpp4;->B()I

    .line 48
    .line 49
    .line 50
    move-result v8

    .line 51
    invoke-interface {v7, v8, v1}, Llq2;->a(ILpp4;)V

    .line 52
    .line 53
    .line 54
    :goto_0
    iget-object v7, v0, La23;->f:Ljava/lang/Object;

    .line 55
    .line 56
    check-cast v7, [Z

    .line 57
    .line 58
    invoke-static {v6, v4, v5, v7}, Ld93;->T([BII[Z)I

    .line 59
    .line 60
    .line 61
    move-result v7

    .line 62
    if-ne v7, v5, :cond_1

    .line 63
    .line 64
    iget-boolean v1, v0, La23;->b:Z

    .line 65
    .line 66
    if-nez v1, :cond_0

    .line 67
    .line 68
    invoke-virtual {v3, v6, v4, v5}, Ly13;->a([BII)V

    .line 69
    .line 70
    .line 71
    :cond_0
    iget-object v0, v0, La23;->i:Ljava/lang/Object;

    .line 72
    .line 73
    check-cast v0, Lz13;

    .line 74
    .line 75
    invoke-virtual {v0, v6, v4, v5}, Lz13;->a([BII)V

    .line 76
    .line 77
    .line 78
    invoke-virtual {v2, v6, v4, v5}, Li23;->d([BII)V

    .line 79
    .line 80
    .line 81
    return-void

    .line 82
    :cond_1
    iget-object v8, v1, Lpp4;->a:[B

    .line 83
    .line 84
    add-int/lit8 v9, v7, 0x3

    .line 85
    .line 86
    aget-byte v8, v8, v9

    .line 87
    .line 88
    and-int/lit16 v10, v8, 0xff

    .line 89
    .line 90
    sub-int v11, v7, v4

    .line 91
    .line 92
    iget-boolean v12, v0, La23;->b:Z

    .line 93
    .line 94
    const/4 v15, 0x1

    .line 95
    if-nez v12, :cond_17

    .line 96
    .line 97
    if-lez v11, :cond_2

    .line 98
    .line 99
    invoke-virtual {v3, v6, v4, v7}, Ly13;->a([BII)V

    .line 100
    .line 101
    .line 102
    :cond_2
    if-gez v11, :cond_3

    .line 103
    .line 104
    neg-int v12, v11

    .line 105
    goto :goto_1

    .line 106
    :cond_3
    const/4 v12, 0x0

    .line 107
    :goto_1
    iget v14, v3, Ly13;->b:I

    .line 108
    .line 109
    if-eqz v14, :cond_15

    .line 110
    .line 111
    const-string v13, "H263Reader"

    .line 112
    .line 113
    move/from16 v16, v5

    .line 114
    .line 115
    const-string v5, "Unexpected start code value"

    .line 116
    .line 117
    if-eq v14, v15, :cond_13

    .line 118
    .line 119
    const/4 v15, 0x2

    .line 120
    if-eq v14, v15, :cond_11

    .line 121
    .line 122
    const/4 v15, 0x3

    .line 123
    if-eq v14, v15, :cond_f

    .line 124
    .line 125
    const/16 v14, 0xb3

    .line 126
    .line 127
    if-eq v10, v14, :cond_5

    .line 128
    .line 129
    const/16 v5, 0xb5

    .line 130
    .line 131
    if-ne v10, v5, :cond_4

    .line 132
    .line 133
    goto :goto_2

    .line 134
    :cond_4
    move/from16 v17, v9

    .line 135
    .line 136
    const/4 v8, 0x0

    .line 137
    goto/16 :goto_7

    .line 138
    .line 139
    :cond_5
    :goto_2
    iget v5, v3, Ly13;->c:I

    .line 140
    .line 141
    sub-int/2addr v5, v12

    .line 142
    iput v5, v3, Ly13;->c:I

    .line 143
    .line 144
    const/4 v5, 0x0

    .line 145
    iput-boolean v5, v3, Ly13;->a:Z

    .line 146
    .line 147
    iget-object v5, v0, La23;->k:Ljava/lang/Object;

    .line 148
    .line 149
    check-cast v5, Llq2;

    .line 150
    .line 151
    iget v8, v3, Ly13;->d:I

    .line 152
    .line 153
    iget-object v12, v0, La23;->j:Ljava/lang/Object;

    .line 154
    .line 155
    check-cast v12, Ljava/lang/String;

    .line 156
    .line 157
    invoke-virtual {v12}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 158
    .line 159
    .line 160
    iget-object v14, v3, Ly13;->e:[B

    .line 161
    .line 162
    iget v15, v3, Ly13;->c:I

    .line 163
    .line 164
    invoke-static {v14, v15}, Ljava/util/Arrays;->copyOf([BI)[B

    .line 165
    .line 166
    .line 167
    move-result-object v14

    .line 168
    new-instance v15, Lhp4;

    .line 169
    .line 170
    move/from16 v17, v9

    .line 171
    .line 172
    array-length v9, v14

    .line 173
    invoke-direct {v15, v14, v9}, Lhp4;-><init>([BI)V

    .line 174
    .line 175
    .line 176
    invoke-virtual {v15, v8}, Lhp4;->l(I)V

    .line 177
    .line 178
    .line 179
    const/4 v8, 0x4

    .line 180
    invoke-virtual {v15, v8}, Lhp4;->l(I)V

    .line 181
    .line 182
    .line 183
    invoke-virtual {v15}, Lhp4;->e()V

    .line 184
    .line 185
    .line 186
    const/16 v9, 0x8

    .line 187
    .line 188
    invoke-virtual {v15, v9}, Lhp4;->f(I)V

    .line 189
    .line 190
    .line 191
    invoke-virtual {v15}, Lhp4;->g()Z

    .line 192
    .line 193
    .line 194
    move-result v18

    .line 195
    if-eqz v18, :cond_6

    .line 196
    .line 197
    invoke-virtual {v15, v8}, Lhp4;->f(I)V

    .line 198
    .line 199
    .line 200
    const/4 v9, 0x3

    .line 201
    invoke-virtual {v15, v9}, Lhp4;->f(I)V

    .line 202
    .line 203
    .line 204
    :cond_6
    invoke-virtual {v15, v8}, Lhp4;->h(I)I

    .line 205
    .line 206
    .line 207
    move-result v8

    .line 208
    const-string v9, "Invalid aspect ratio"

    .line 209
    .line 210
    move-object/from16 v19, v14

    .line 211
    .line 212
    const/16 v14, 0xf

    .line 213
    .line 214
    if-ne v8, v14, :cond_8

    .line 215
    .line 216
    const/16 v14, 0x8

    .line 217
    .line 218
    invoke-virtual {v15, v14}, Lhp4;->h(I)I

    .line 219
    .line 220
    .line 221
    move-result v8

    .line 222
    invoke-virtual {v15, v14}, Lhp4;->h(I)I

    .line 223
    .line 224
    .line 225
    move-result v14

    .line 226
    if-nez v14, :cond_7

    .line 227
    .line 228
    invoke-static {v13, v9}, Lht3;->J(Ljava/lang/String;Ljava/lang/String;)V

    .line 229
    .line 230
    .line 231
    :goto_3
    const/high16 v9, 0x3f800000    # 1.0f

    .line 232
    .line 233
    goto :goto_4

    .line 234
    :cond_7
    int-to-float v8, v8

    .line 235
    int-to-float v9, v14

    .line 236
    div-float v9, v8, v9

    .line 237
    .line 238
    goto :goto_4

    .line 239
    :cond_8
    const/4 v14, 0x7

    .line 240
    if-ge v8, v14, :cond_9

    .line 241
    .line 242
    sget-object v9, La23;->l:[F

    .line 243
    .line 244
    aget v9, v9, v8

    .line 245
    .line 246
    goto :goto_4

    .line 247
    :cond_9
    invoke-static {v13, v9}, Lht3;->J(Ljava/lang/String;Ljava/lang/String;)V

    .line 248
    .line 249
    .line 250
    goto :goto_3

    .line 251
    :goto_4
    invoke-virtual {v15}, Lhp4;->g()Z

    .line 252
    .line 253
    .line 254
    move-result v8

    .line 255
    if-eqz v8, :cond_a

    .line 256
    .line 257
    const/4 v8, 0x2

    .line 258
    invoke-virtual {v15, v8}, Lhp4;->f(I)V

    .line 259
    .line 260
    .line 261
    const/4 v8, 0x1

    .line 262
    invoke-virtual {v15, v8}, Lhp4;->f(I)V

    .line 263
    .line 264
    .line 265
    invoke-virtual {v15}, Lhp4;->g()Z

    .line 266
    .line 267
    .line 268
    move-result v8

    .line 269
    if-eqz v8, :cond_a

    .line 270
    .line 271
    const/16 v8, 0xf

    .line 272
    .line 273
    invoke-virtual {v15, v8}, Lhp4;->f(I)V

    .line 274
    .line 275
    .line 276
    invoke-virtual {v15}, Lhp4;->e()V

    .line 277
    .line 278
    .line 279
    invoke-virtual {v15, v8}, Lhp4;->f(I)V

    .line 280
    .line 281
    .line 282
    invoke-virtual {v15}, Lhp4;->e()V

    .line 283
    .line 284
    .line 285
    invoke-virtual {v15, v8}, Lhp4;->f(I)V

    .line 286
    .line 287
    .line 288
    invoke-virtual {v15}, Lhp4;->e()V

    .line 289
    .line 290
    .line 291
    const/4 v14, 0x3

    .line 292
    invoke-virtual {v15, v14}, Lhp4;->f(I)V

    .line 293
    .line 294
    .line 295
    const/16 v14, 0xb

    .line 296
    .line 297
    invoke-virtual {v15, v14}, Lhp4;->f(I)V

    .line 298
    .line 299
    .line 300
    invoke-virtual {v15}, Lhp4;->e()V

    .line 301
    .line 302
    .line 303
    invoke-virtual {v15, v8}, Lhp4;->f(I)V

    .line 304
    .line 305
    .line 306
    invoke-virtual {v15}, Lhp4;->e()V

    .line 307
    .line 308
    .line 309
    :cond_a
    const/4 v8, 0x2

    .line 310
    invoke-virtual {v15, v8}, Lhp4;->h(I)I

    .line 311
    .line 312
    .line 313
    move-result v8

    .line 314
    if-eqz v8, :cond_b

    .line 315
    .line 316
    const-string v8, "Unhandled video object layer shape"

    .line 317
    .line 318
    invoke-static {v13, v8}, Lht3;->J(Ljava/lang/String;Ljava/lang/String;)V

    .line 319
    .line 320
    .line 321
    :cond_b
    invoke-virtual {v15}, Lhp4;->e()V

    .line 322
    .line 323
    .line 324
    const/16 v8, 0x10

    .line 325
    .line 326
    invoke-virtual {v15, v8}, Lhp4;->h(I)I

    .line 327
    .line 328
    .line 329
    move-result v8

    .line 330
    invoke-virtual {v15}, Lhp4;->e()V

    .line 331
    .line 332
    .line 333
    invoke-virtual {v15}, Lhp4;->g()Z

    .line 334
    .line 335
    .line 336
    move-result v14

    .line 337
    if-eqz v14, :cond_e

    .line 338
    .line 339
    if-nez v8, :cond_c

    .line 340
    .line 341
    const-string v8, "Invalid vop_increment_time_resolution"

    .line 342
    .line 343
    invoke-static {v13, v8}, Lht3;->J(Ljava/lang/String;Ljava/lang/String;)V

    .line 344
    .line 345
    .line 346
    goto :goto_6

    .line 347
    :cond_c
    add-int/lit8 v8, v8, -0x1

    .line 348
    .line 349
    const/4 v13, 0x0

    .line 350
    :goto_5
    if-lez v8, :cond_d

    .line 351
    .line 352
    shr-int/lit8 v8, v8, 0x1

    .line 353
    .line 354
    add-int/lit8 v13, v13, 0x1

    .line 355
    .line 356
    goto :goto_5

    .line 357
    :cond_d
    invoke-virtual {v15, v13}, Lhp4;->f(I)V

    .line 358
    .line 359
    .line 360
    :cond_e
    :goto_6
    invoke-virtual {v15}, Lhp4;->e()V

    .line 361
    .line 362
    .line 363
    const/16 v8, 0xd

    .line 364
    .line 365
    invoke-virtual {v15, v8}, Lhp4;->h(I)I

    .line 366
    .line 367
    .line 368
    move-result v13

    .line 369
    invoke-virtual {v15}, Lhp4;->e()V

    .line 370
    .line 371
    .line 372
    invoke-virtual {v15, v8}, Lhp4;->h(I)I

    .line 373
    .line 374
    .line 375
    move-result v8

    .line 376
    invoke-virtual {v15}, Lhp4;->e()V

    .line 377
    .line 378
    .line 379
    invoke-virtual {v15}, Lhp4;->e()V

    .line 380
    .line 381
    .line 382
    new-instance v14, Lgr6;

    .line 383
    .line 384
    invoke-direct {v14}, Lgr6;-><init>()V

    .line 385
    .line 386
    .line 387
    iput-object v12, v14, Lgr6;->a:Ljava/lang/String;

    .line 388
    .line 389
    const-string v12, "video/mp2t"

    .line 390
    .line 391
    invoke-virtual {v14, v12}, Lgr6;->d(Ljava/lang/String;)V

    .line 392
    .line 393
    .line 394
    const-string v12, "video/mp4v-es"

    .line 395
    .line 396
    invoke-virtual {v14, v12}, Lgr6;->e(Ljava/lang/String;)V

    .line 397
    .line 398
    .line 399
    iput v13, v14, Lgr6;->u:I

    .line 400
    .line 401
    iput v8, v14, Lgr6;->v:I

    .line 402
    .line 403
    iput v9, v14, Lgr6;->A:F

    .line 404
    .line 405
    invoke-static/range {v19 .. v19}, Ljava/util/Collections;->singletonList(Ljava/lang/Object;)Ljava/util/List;

    .line 406
    .line 407
    .line 408
    move-result-object v8

    .line 409
    iput-object v8, v14, Lgr6;->q:Ljava/util/List;

    .line 410
    .line 411
    new-instance v8, Luu6;

    .line 412
    .line 413
    invoke-direct {v8, v14}, Luu6;-><init>(Lgr6;)V

    .line 414
    .line 415
    .line 416
    invoke-interface {v5, v8}, Llq2;->f(Luu6;)V

    .line 417
    .line 418
    .line 419
    const/4 v8, 0x1

    .line 420
    iput-boolean v8, v0, La23;->b:Z

    .line 421
    .line 422
    goto :goto_8

    .line 423
    :cond_f
    move/from16 v17, v9

    .line 424
    .line 425
    and-int/lit16 v8, v8, 0xf0

    .line 426
    .line 427
    const/16 v9, 0x20

    .line 428
    .line 429
    if-eq v8, v9, :cond_10

    .line 430
    .line 431
    invoke-static {v13, v5}, Lht3;->J(Ljava/lang/String;Ljava/lang/String;)V

    .line 432
    .line 433
    .line 434
    const/4 v8, 0x0

    .line 435
    iput-boolean v8, v3, Ly13;->a:Z

    .line 436
    .line 437
    iput v8, v3, Ly13;->c:I

    .line 438
    .line 439
    iput v8, v3, Ly13;->b:I

    .line 440
    .line 441
    goto :goto_7

    .line 442
    :cond_10
    const/4 v8, 0x0

    .line 443
    iget v5, v3, Ly13;->c:I

    .line 444
    .line 445
    iput v5, v3, Ly13;->d:I

    .line 446
    .line 447
    const/4 v5, 0x4

    .line 448
    iput v5, v3, Ly13;->b:I

    .line 449
    .line 450
    goto :goto_7

    .line 451
    :cond_11
    move/from16 v17, v9

    .line 452
    .line 453
    const/4 v8, 0x0

    .line 454
    const/16 v9, 0x1f

    .line 455
    .line 456
    if-le v10, v9, :cond_12

    .line 457
    .line 458
    invoke-static {v13, v5}, Lht3;->J(Ljava/lang/String;Ljava/lang/String;)V

    .line 459
    .line 460
    .line 461
    iput-boolean v8, v3, Ly13;->a:Z

    .line 462
    .line 463
    iput v8, v3, Ly13;->c:I

    .line 464
    .line 465
    iput v8, v3, Ly13;->b:I

    .line 466
    .line 467
    goto :goto_7

    .line 468
    :cond_12
    const/4 v14, 0x3

    .line 469
    iput v14, v3, Ly13;->b:I

    .line 470
    .line 471
    goto :goto_7

    .line 472
    :cond_13
    move/from16 v17, v9

    .line 473
    .line 474
    const/4 v8, 0x0

    .line 475
    const/16 v9, 0xb5

    .line 476
    .line 477
    if-eq v10, v9, :cond_14

    .line 478
    .line 479
    invoke-static {v13, v5}, Lht3;->J(Ljava/lang/String;Ljava/lang/String;)V

    .line 480
    .line 481
    .line 482
    iput-boolean v8, v3, Ly13;->a:Z

    .line 483
    .line 484
    iput v8, v3, Ly13;->c:I

    .line 485
    .line 486
    iput v8, v3, Ly13;->b:I

    .line 487
    .line 488
    goto :goto_7

    .line 489
    :cond_14
    const/4 v15, 0x2

    .line 490
    iput v15, v3, Ly13;->b:I

    .line 491
    .line 492
    goto :goto_7

    .line 493
    :cond_15
    move/from16 v16, v5

    .line 494
    .line 495
    move/from16 v17, v9

    .line 496
    .line 497
    const/4 v8, 0x0

    .line 498
    const/16 v5, 0xb0

    .line 499
    .line 500
    if-ne v10, v5, :cond_16

    .line 501
    .line 502
    const/4 v5, 0x1

    .line 503
    iput v5, v3, Ly13;->b:I

    .line 504
    .line 505
    iput-boolean v5, v3, Ly13;->a:Z

    .line 506
    .line 507
    :cond_16
    :goto_7
    sget-object v5, Ly13;->f:[B

    .line 508
    .line 509
    const/4 v14, 0x3

    .line 510
    invoke-virtual {v3, v5, v8, v14}, Ly13;->a([BII)V

    .line 511
    .line 512
    .line 513
    goto :goto_8

    .line 514
    :cond_17
    move/from16 v16, v5

    .line 515
    .line 516
    move/from16 v17, v9

    .line 517
    .line 518
    :goto_8
    iget-object v5, v0, La23;->i:Ljava/lang/Object;

    .line 519
    .line 520
    check-cast v5, Lz13;

    .line 521
    .line 522
    invoke-virtual {v5, v6, v4, v7}, Lz13;->a([BII)V

    .line 523
    .line 524
    .line 525
    if-lez v11, :cond_18

    .line 526
    .line 527
    invoke-virtual {v2, v6, v4, v7}, Li23;->d([BII)V

    .line 528
    .line 529
    .line 530
    const/4 v4, 0x0

    .line 531
    goto :goto_9

    .line 532
    :cond_18
    neg-int v4, v11

    .line 533
    :goto_9
    invoke-virtual {v2, v4}, Li23;->e(I)Z

    .line 534
    .line 535
    .line 536
    move-result v4

    .line 537
    if-eqz v4, :cond_19

    .line 538
    .line 539
    iget-object v4, v2, Li23;->e:Ljava/lang/Object;

    .line 540
    .line 541
    check-cast v4, [B

    .line 542
    .line 543
    iget v5, v2, Li23;->d:I

    .line 544
    .line 545
    invoke-static {v4, v5}, Ld93;->A([BI)I

    .line 546
    .line 547
    .line 548
    move-result v4

    .line 549
    iget-object v5, v0, La23;->e:Ljava/lang/Object;

    .line 550
    .line 551
    check-cast v5, Lpp4;

    .line 552
    .line 553
    sget-object v8, Lxw4;->a:Ljava/lang/String;

    .line 554
    .line 555
    iget-object v8, v2, Li23;->e:Ljava/lang/Object;

    .line 556
    .line 557
    check-cast v8, [B

    .line 558
    .line 559
    invoke-virtual {v5, v8, v4}, Lpp4;->z([BI)V

    .line 560
    .line 561
    .line 562
    iget-object v4, v0, La23;->d:Ljava/lang/Object;

    .line 563
    .line 564
    check-cast v4, Lzc2;

    .line 565
    .line 566
    iget-wide v8, v0, La23;->c:J

    .line 567
    .line 568
    invoke-virtual {v4, v8, v9, v5}, Lzc2;->B(JLpp4;)V

    .line 569
    .line 570
    .line 571
    :cond_19
    const/16 v4, 0xb2

    .line 572
    .line 573
    if-ne v10, v4, :cond_1b

    .line 574
    .line 575
    iget-object v5, v1, Lpp4;->a:[B

    .line 576
    .line 577
    add-int/lit8 v8, v7, 0x2

    .line 578
    .line 579
    aget-byte v5, v5, v8

    .line 580
    .line 581
    const/4 v8, 0x1

    .line 582
    if-ne v5, v8, :cond_1a

    .line 583
    .line 584
    invoke-virtual {v2, v4}, Li23;->c(I)V

    .line 585
    .line 586
    .line 587
    :cond_1a
    move v10, v4

    .line 588
    goto :goto_a

    .line 589
    :cond_1b
    const/4 v8, 0x1

    .line 590
    :goto_a
    sub-int v5, v16, v7

    .line 591
    .line 592
    iget-wide v11, v0, La23;->a:J

    .line 593
    .line 594
    int-to-long v13, v5

    .line 595
    sub-long/2addr v11, v13

    .line 596
    iget-object v4, v0, La23;->i:Ljava/lang/Object;

    .line 597
    .line 598
    check-cast v4, Lz13;

    .line 599
    .line 600
    iget-boolean v7, v0, La23;->b:Z

    .line 601
    .line 602
    invoke-virtual {v4, v5, v11, v12, v7}, Lz13;->b(IJZ)V

    .line 603
    .line 604
    .line 605
    iget-object v4, v0, La23;->i:Ljava/lang/Object;

    .line 606
    .line 607
    check-cast v4, Lz13;

    .line 608
    .line 609
    iget-wide v11, v0, La23;->c:J

    .line 610
    .line 611
    iput v10, v4, Lz13;->e:I

    .line 612
    .line 613
    const/4 v5, 0x0

    .line 614
    iput-boolean v5, v4, Lz13;->d:Z

    .line 615
    .line 616
    const/16 v5, 0xb6

    .line 617
    .line 618
    if-eq v10, v5, :cond_1d

    .line 619
    .line 620
    const/16 v14, 0xb3

    .line 621
    .line 622
    if-ne v10, v14, :cond_1c

    .line 623
    .line 624
    move v7, v8

    .line 625
    move v13, v14

    .line 626
    goto :goto_b

    .line 627
    :cond_1c
    move v13, v10

    .line 628
    const/4 v7, 0x0

    .line 629
    goto :goto_b

    .line 630
    :cond_1d
    move v7, v8

    .line 631
    move v13, v10

    .line 632
    :goto_b
    iput-boolean v7, v4, Lz13;->b:Z

    .line 633
    .line 634
    if-ne v13, v5, :cond_1e

    .line 635
    .line 636
    move v15, v8

    .line 637
    goto :goto_c

    .line 638
    :cond_1e
    const/4 v15, 0x0

    .line 639
    :goto_c
    iput-boolean v15, v4, Lz13;->c:Z

    .line 640
    .line 641
    const/4 v5, 0x0

    .line 642
    iput v5, v4, Lz13;->f:I

    .line 643
    .line 644
    iput-wide v11, v4, Lz13;->h:J

    .line 645
    .line 646
    move/from16 v5, v16

    .line 647
    .line 648
    move/from16 v4, v17

    .line 649
    .line 650
    goto/16 :goto_0
.end method

.method public d(Lxn2;Lcg1;)V
    .locals 2

    .line 1
    invoke-virtual {p2}, Lcg1;->d()V

    .line 2
    .line 3
    .line 4
    invoke-virtual {p2}, Lcg1;->e()V

    .line 5
    .line 6
    .line 7
    iget-object v0, p2, Lcg1;->e:Ljava/io/Serializable;

    .line 8
    .line 9
    check-cast v0, Ljava/lang/String;

    .line 10
    .line 11
    iput-object v0, p0, La23;->j:Ljava/lang/Object;

    .line 12
    .line 13
    invoke-virtual {p2}, Lcg1;->e()V

    .line 14
    .line 15
    .line 16
    iget v0, p2, Lcg1;->d:I

    .line 17
    .line 18
    const/4 v1, 0x2

    .line 19
    invoke-interface {p1, v0, v1}, Lxn2;->f(II)Llq2;

    .line 20
    .line 21
    .line 22
    move-result-object v0

    .line 23
    iput-object v0, p0, La23;->k:Ljava/lang/Object;

    .line 24
    .line 25
    new-instance v1, Lz13;

    .line 26
    .line 27
    invoke-direct {v1, v0}, Lz13;-><init>(Llq2;)V

    .line 28
    .line 29
    .line 30
    iput-object v1, p0, La23;->i:Ljava/lang/Object;

    .line 31
    .line 32
    iget-object p0, p0, La23;->d:Ljava/lang/Object;

    .line 33
    .line 34
    check-cast p0, Lzc2;

    .line 35
    .line 36
    invoke-virtual {p0, p1, p2}, Lzc2;->A(Lxn2;Lcg1;)V

    .line 37
    .line 38
    .line 39
    return-void
.end method

.method public e(JLjava/lang/Object;)V
    .locals 0

    .line 1
    invoke-virtual {p3}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 2
    .line 3
    .line 4
    invoke-virtual {p0}, La23;->j()V

    .line 5
    .line 6
    .line 7
    invoke-virtual {p0, p1, p2, p3}, La23;->g(JLjava/lang/Object;)V

    .line 8
    .line 9
    .line 10
    return-void
.end method

.method public f(Ljava/lang/Object;)J
    .locals 4

    .line 1
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 2
    .line 3
    .line 4
    invoke-virtual {p0}, La23;->j()V

    .line 5
    .line 6
    .line 7
    invoke-virtual {p0, p1}, La23;->h(Ljava/lang/Object;)Z

    .line 8
    .line 9
    .line 10
    move-result v0

    .line 11
    if-nez v0, :cond_0

    .line 12
    .line 13
    iget-wide v0, p0, La23;->a:J

    .line 14
    .line 15
    const-wide/16 v2, 0x1

    .line 16
    .line 17
    add-long/2addr v2, v0

    .line 18
    iput-wide v2, p0, La23;->a:J

    .line 19
    .line 20
    invoke-virtual {p0, v0, v1, p1}, La23;->g(JLjava/lang/Object;)V

    .line 21
    .line 22
    .line 23
    return-wide v0

    .line 24
    :cond_0
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 25
    .line 26
    .line 27
    move-result-object p0

    .line 28
    const-string p1, "Instance of "

    .line 29
    .line 30
    const-string v0, " has already been added."

    .line 31
    .line 32
    invoke-static {p0, v0, p1}, Lm81;->l(Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/String;)V

    .line 33
    .line 34
    .line 35
    const-wide/16 p0, 0x0

    .line 36
    .line 37
    return-wide p0
.end method

.method public g(JLjava/lang/Object;)V
    .locals 4

    .line 1
    iget-object v0, p0, La23;->f:Ljava/lang/Object;

    .line 2
    .line 3
    check-cast v0, Ljava/util/HashMap;

    .line 4
    .line 5
    const-wide/16 v1, 0x0

    .line 6
    .line 7
    cmp-long v1, p1, v1

    .line 8
    .line 9
    if-ltz v1, :cond_1

    .line 10
    .line 11
    invoke-static {p1, p2}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 12
    .line 13
    .line 14
    move-result-object v1

    .line 15
    invoke-virtual {v0, v1}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    .line 16
    .line 17
    .line 18
    move-result v1

    .line 19
    if-nez v1, :cond_0

    .line 20
    .line 21
    new-instance v1, Lp4;

    .line 22
    .line 23
    iget-object v2, p0, La23;->h:Ljava/lang/Object;

    .line 24
    .line 25
    check-cast v2, Ljava/lang/ref/ReferenceQueue;

    .line 26
    .line 27
    invoke-direct {v1, p3, v2}, Lp4;-><init>(Ljava/lang/Object;Ljava/lang/ref/ReferenceQueue;)V

    .line 28
    .line 29
    .line 30
    iget-object v2, p0, La23;->e:Ljava/lang/Object;

    .line 31
    .line 32
    check-cast v2, Ljava/util/WeakHashMap;

    .line 33
    .line 34
    invoke-static {p1, p2}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 35
    .line 36
    .line 37
    move-result-object v3

    .line 38
    invoke-interface {v2, v1, v3}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 39
    .line 40
    .line 41
    invoke-static {p1, p2}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 42
    .line 43
    .line 44
    move-result-object v2

    .line 45
    invoke-interface {v0, v2, v1}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 46
    .line 47
    .line 48
    iget-object v0, p0, La23;->i:Ljava/lang/Object;

    .line 49
    .line 50
    check-cast v0, Ljava/util/HashMap;

    .line 51
    .line 52
    invoke-static {p1, p2}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 53
    .line 54
    .line 55
    move-result-object v2

    .line 56
    invoke-interface {v0, v1, v2}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 57
    .line 58
    .line 59
    iget-object p0, p0, La23;->g:Ljava/lang/Object;

    .line 60
    .line 61
    check-cast p0, Ljava/util/HashMap;

    .line 62
    .line 63
    invoke-static {p1, p2}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 64
    .line 65
    .line 66
    move-result-object p1

    .line 67
    invoke-interface {p0, p1, p3}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 68
    .line 69
    .line 70
    return-void

    .line 71
    :cond_0
    new-instance p0, Ljava/lang/StringBuilder;

    .line 72
    .line 73
    const-string p3, "Identifier has already been added: "

    .line 74
    .line 75
    invoke-direct {p0, p3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 76
    .line 77
    .line 78
    invoke-virtual {p0, p1, p2}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    .line 79
    .line 80
    .line 81
    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 82
    .line 83
    .line 84
    move-result-object p0

    .line 85
    new-instance p1, Ljava/lang/IllegalArgumentException;

    .line 86
    .line 87
    invoke-virtual {p0}, Ljava/lang/Object;->toString()Ljava/lang/String;

    .line 88
    .line 89
    .line 90
    move-result-object p0

    .line 91
    invoke-direct {p1, p0}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    .line 92
    .line 93
    .line 94
    throw p1

    .line 95
    :cond_1
    new-instance p0, Ljava/lang/StringBuilder;

    .line 96
    .line 97
    const-string p3, "Identifier must be >= 0: "

    .line 98
    .line 99
    invoke-direct {p0, p3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 100
    .line 101
    .line 102
    invoke-virtual {p0, p1, p2}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    .line 103
    .line 104
    .line 105
    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 106
    .line 107
    .line 108
    move-result-object p0

    .line 109
    new-instance p1, Ljava/lang/IllegalArgumentException;

    .line 110
    .line 111
    invoke-virtual {p0}, Ljava/lang/Object;->toString()Ljava/lang/String;

    .line 112
    .line 113
    .line 114
    move-result-object p0

    .line 115
    invoke-direct {p1, p0}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    .line 116
    .line 117
    .line 118
    throw p1
.end method

.method public h(Ljava/lang/Object;)Z
    .locals 2

    .line 1
    invoke-virtual {p0}, La23;->j()V

    .line 2
    .line 3
    .line 4
    if-eqz p1, :cond_0

    .line 5
    .line 6
    iget-object p0, p0, La23;->e:Ljava/lang/Object;

    .line 7
    .line 8
    check-cast p0, Ljava/util/WeakHashMap;

    .line 9
    .line 10
    new-instance v0, Lp4;

    .line 11
    .line 12
    const/4 v1, 0x0

    .line 13
    invoke-direct {v0, p1, v1}, Lp4;-><init>(Ljava/lang/Object;Ljava/lang/ref/ReferenceQueue;)V

    .line 14
    .line 15
    .line 16
    invoke-virtual {p0, v0}, Ljava/util/WeakHashMap;->containsKey(Ljava/lang/Object;)Z

    .line 17
    .line 18
    .line 19
    move-result p0

    .line 20
    if-eqz p0, :cond_0

    .line 21
    .line 22
    const/4 p0, 0x1

    .line 23
    return p0

    .line 24
    :cond_0
    const/4 p0, 0x0

    .line 25
    return p0
.end method

.method public i(J)Ljava/lang/Object;
    .locals 0

    .line 1
    invoke-virtual {p0}, La23;->j()V

    .line 2
    .line 3
    .line 4
    iget-object p0, p0, La23;->f:Ljava/lang/Object;

    .line 5
    .line 6
    check-cast p0, Ljava/util/HashMap;

    .line 7
    .line 8
    invoke-static {p1, p2}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 9
    .line 10
    .line 11
    move-result-object p1

    .line 12
    invoke-virtual {p0, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    .line 13
    .line 14
    .line 15
    move-result-object p0

    .line 16
    check-cast p0, Lp4;

    .line 17
    .line 18
    if-eqz p0, :cond_0

    .line 19
    .line 20
    invoke-virtual {p0}, Ljava/lang/ref/Reference;->get()Ljava/lang/Object;

    .line 21
    .line 22
    .line 23
    move-result-object p0

    .line 24
    return-object p0

    .line 25
    :cond_0
    const/4 p0, 0x0

    .line 26
    return-object p0
.end method

.method public j()V
    .locals 1

    .line 1
    iget-boolean p0, p0, La23;->b:Z

    .line 2
    .line 3
    if-eqz p0, :cond_0

    .line 4
    .line 5
    const-string p0, "PigeonInstanceManager"

    .line 6
    .line 7
    const-string v0, "The manager was used after calls to the PigeonFinalizationListener has been stopped."

    .line 8
    .line 9
    invoke-static {p0, v0}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 10
    .line 11
    .line 12
    :cond_0
    return-void
.end method

.method public zza()V
    .locals 2

    .line 1
    iget-object v0, p0, La23;->f:Ljava/lang/Object;

    .line 2
    .line 3
    check-cast v0, [Z

    .line 4
    .line 5
    invoke-static {v0}, Ld93;->V([Z)V

    .line 6
    .line 7
    .line 8
    iget-object v0, p0, La23;->g:Ljava/lang/Object;

    .line 9
    .line 10
    check-cast v0, Ly13;

    .line 11
    .line 12
    const/4 v1, 0x0

    .line 13
    iput-boolean v1, v0, Ly13;->a:Z

    .line 14
    .line 15
    iput v1, v0, Ly13;->c:I

    .line 16
    .line 17
    iput v1, v0, Ly13;->b:I

    .line 18
    .line 19
    iget-object v0, p0, La23;->i:Ljava/lang/Object;

    .line 20
    .line 21
    check-cast v0, Lz13;

    .line 22
    .line 23
    if-eqz v0, :cond_0

    .line 24
    .line 25
    iput-boolean v1, v0, Lz13;->b:Z

    .line 26
    .line 27
    iput-boolean v1, v0, Lz13;->c:Z

    .line 28
    .line 29
    iput-boolean v1, v0, Lz13;->d:Z

    .line 30
    .line 31
    const/4 v1, -0x1

    .line 32
    iput v1, v0, Lz13;->e:I

    .line 33
    .line 34
    :cond_0
    iget-object v0, p0, La23;->h:Ljava/lang/Object;

    .line 35
    .line 36
    check-cast v0, Li23;

    .line 37
    .line 38
    invoke-virtual {v0}, Li23;->a()V

    .line 39
    .line 40
    .line 41
    const-wide/16 v0, 0x0

    .line 42
    .line 43
    iput-wide v0, p0, La23;->a:J

    .line 44
    .line 45
    const-wide v0, -0x7fffffffffffffffL    # -4.9E-324

    .line 46
    .line 47
    .line 48
    .line 49
    .line 50
    iput-wide v0, p0, La23;->c:J

    .line 51
    .line 52
    return-void
.end method
