.class public final La25;
.super Ljava/lang/Object;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"

# interfaces
.implements Ljava/lang/Runnable;


# instance fields
.field public final synthetic a:I

.field public b:Ljava/lang/Object;


# direct methods
.method public synthetic constructor <init>()V
    .locals 1

    .line 15
    const/16 v0, 0xb

    iput v0, p0, La25;->a:I

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public constructor <init>(Ld25;)V
    .locals 1

    .line 1
    const/4 v0, 0x0

    .line 2
    iput v0, p0, La25;->a:I

    .line 3
    .line 4
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 5
    .line 6
    .line 7
    invoke-static {p1}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    .line 8
    .line 9
    .line 10
    iput-object p1, p0, La25;->b:Ljava/lang/Object;

    .line 11
    .line 12
    return-void
.end method

.method public synthetic constructor <init>(Ljava/lang/Object;I)V
    .locals 0

    .line 13
    iput p2, p0, La25;->a:I

    iput-object p1, p0, La25;->b:Ljava/lang/Object;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public constructor <init>(Loi5;Z)V
    .locals 0

    const/16 p2, 0xa

    iput p2, p0, La25;->a:I

    .line 16
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, La25;->b:Ljava/lang/Object;

    return-void
.end method

.method public constructor <init>(Lok6;Lvc;)V
    .locals 0

    const/16 p2, 0x14

    iput p2, p0, La25;->a:I

    .line 17
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, La25;->b:Ljava/lang/Object;

    return-void
.end method

.method public synthetic constructor <init>(Luc6;I)V
    .locals 0

    const/16 p2, 0xe

    iput p2, p0, La25;->a:I

    .line 14
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, La25;->b:Ljava/lang/Object;

    return-void
.end method


# virtual methods
.method public final run()V
    .locals 12

    .line 1
    iget v0, p0, La25;->a:I

    .line 2
    .line 3
    const/4 v1, 0x2

    .line 4
    const/4 v2, 0x3

    .line 5
    const-wide/16 v3, 0x0

    .line 6
    .line 7
    const/4 v5, 0x0

    .line 8
    const/4 v6, 0x0

    .line 9
    const/4 v7, 0x1

    .line 10
    packed-switch v0, :pswitch_data_0

    .line 11
    .line 12
    .line 13
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 14
    .line 15
    check-cast p0, Lrs6;

    .line 16
    .line 17
    iget-wide v0, p0, Lrs6;->V:J

    .line 18
    .line 19
    const-wide/32 v5, 0x493e0

    .line 20
    .line 21
    .line 22
    cmp-long v0, v0, v5

    .line 23
    .line 24
    if-ltz v0, :cond_0

    .line 25
    .line 26
    iget-object v0, p0, Lrs6;->l:Lyp3;

    .line 27
    .line 28
    iget-object v0, v0, Lyp3;->b:Ljava/lang/Object;

    .line 29
    .line 30
    check-cast v0, Lgt6;

    .line 31
    .line 32
    iput-boolean v7, v0, Lgt6;->s1:Z

    .line 33
    .line 34
    iput-wide v3, p0, Lrs6;->V:J

    .line 35
    .line 36
    :cond_0
    return-void

    .line 37
    :pswitch_0
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 38
    .line 39
    check-cast p0, Lqe;

    .line 40
    .line 41
    iget-object p0, p0, Lqe;->b:Ljava/lang/Object;

    .line 42
    .line 43
    check-cast p0, Lbz5;

    .line 44
    .line 45
    iget-object v0, p0, Lbz5;->W:Lic6;

    .line 46
    .line 47
    invoke-static {v0}, Lbz5;->e(Lbs4;)V

    .line 48
    .line 49
    .line 50
    iget-object p0, p0, Lbz5;->W:Lic6;

    .line 51
    .line 52
    sget-object v0, Lp25;->D:Lc25;

    .line 53
    .line 54
    invoke-virtual {v0, v5}, Lc25;->a(Ljava/lang/Object;)Ljava/lang/Object;

    .line 55
    .line 56
    .line 57
    move-result-object v0

    .line 58
    check-cast v0, Ljava/lang/Long;

    .line 59
    .line 60
    invoke-virtual {v0}, Ljava/lang/Long;->longValue()J

    .line 61
    .line 62
    .line 63
    move-result-wide v0

    .line 64
    invoke-virtual {p0, v0, v1}, Lic6;->V1(J)V

    .line 65
    .line 66
    .line 67
    return-void

    .line 68
    :pswitch_1
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 69
    .line 70
    check-cast p0, Lrl;

    .line 71
    .line 72
    invoke-interface {p0}, Lrl;->g()V

    .line 73
    .line 74
    .line 75
    return-void

    .line 76
    :pswitch_2
    const-string v0, "StorageInfoHandler"

    .line 77
    .line 78
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 79
    .line 80
    check-cast p0, Ld80;

    .line 81
    .line 82
    :try_start_0
    invoke-static {p0}, Lih0;->b(Ljava/util/concurrent/Future;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 83
    .line 84
    .line 85
    goto :goto_0

    .line 86
    :catch_0
    move-exception p0

    .line 87
    invoke-static {v0, v2}, Landroid/util/Log;->isLoggable(Ljava/lang/String;I)Z

    .line 88
    .line 89
    .line 90
    move-result v1

    .line 91
    if-eqz v1, :cond_1

    .line 92
    .line 93
    const-string v1, "Failed to get storage info from GMS"

    .line 94
    .line 95
    invoke-static {v0, v1, p0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 96
    .line 97
    .line 98
    :cond_1
    :goto_0
    return-void

    .line 99
    :pswitch_3
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 100
    .line 101
    check-cast p0, Lvm6;

    .line 102
    .line 103
    invoke-virtual {p0}, Lvm6;->c()V

    .line 104
    .line 105
    .line 106
    return-void

    .line 107
    :pswitch_4
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 108
    .line 109
    check-cast p0, Lhm6;

    .line 110
    .line 111
    iget-object p0, p0, Lhm6;->c:Lqi6;

    .line 112
    .line 113
    invoke-virtual {p0}, Lqi6;->get()Ljava/lang/Object;

    .line 114
    .line 115
    .line 116
    move-result-object p0

    .line 117
    check-cast p0, Ljava/lang/Boolean;

    .line 118
    .line 119
    invoke-virtual {p0}, Ljava/lang/Boolean;->booleanValue()Z

    .line 120
    .line 121
    .line 122
    move-result p0

    .line 123
    if-eqz p0, :cond_2

    .line 124
    .line 125
    const-string p0, "PhenotypeProcessReaper"

    .line 126
    .line 127
    const-string v0, "Killing process to refresh experiment configuration"

    .line 128
    .line 129
    invoke-static {p0, v0}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 130
    .line 131
    .line 132
    invoke-static {}, Landroid/os/Process;->myPid()I

    .line 133
    .line 134
    .line 135
    move-result p0

    .line 136
    invoke-static {p0}, Landroid/os/Process;->killProcess(I)V

    .line 137
    .line 138
    .line 139
    invoke-static {v6}, Ljava/lang/System;->exit(I)V

    .line 140
    .line 141
    .line 142
    :cond_2
    return-void

    .line 143
    :pswitch_5
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 144
    .line 145
    check-cast p0, Lc80;

    .line 146
    .line 147
    :try_start_1
    invoke-static {p0}, Lih0;->b(Ljava/util/concurrent/Future;)Ljava/lang/Object;
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    .line 148
    .line 149
    .line 150
    goto :goto_1

    .line 151
    :catch_1
    move-exception p0

    .line 152
    const-string v0, "PhFlagUpdateRegistry"

    .line 153
    .line 154
    const-string v1, "Failed to register flag update listener which may lead to stale flags."

    .line 155
    .line 156
    invoke-static {v0, v1, p0}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 157
    .line 158
    .line 159
    :goto_1
    return-void

    .line 160
    :pswitch_6
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 161
    .line 162
    check-cast p0, Lcom/google/common/util/concurrent/ListenableFuture;

    .line 163
    .line 164
    :try_start_2
    invoke-static {p0}, Lih0;->b(Ljava/util/concurrent/Future;)Ljava/lang/Object;
    :try_end_2
    .catch Ljava/util/concurrent/ExecutionException; {:try_start_2 .. :try_end_2} :catch_2

    .line 165
    .line 166
    .line 167
    goto :goto_2

    .line 168
    :catch_2
    move-exception p0

    .line 169
    new-instance v0, La25;

    .line 170
    .line 171
    const/16 v1, 0x15

    .line 172
    .line 173
    invoke-direct {v0, p0, v1}, La25;-><init>(Ljava/lang/Object;I)V

    .line 174
    .line 175
    .line 176
    invoke-static {}, Lmb6;->N()Landroid/os/Handler;

    .line 177
    .line 178
    .line 179
    move-result-object p0

    .line 180
    invoke-virtual {p0, v0}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 181
    .line 182
    .line 183
    :goto_2
    return-void

    .line 184
    :pswitch_7
    new-instance v0, Ljava/lang/RuntimeException;

    .line 185
    .line 186
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 187
    .line 188
    check-cast p0, Ljava/util/concurrent/ExecutionException;

    .line 189
    .line 190
    invoke-virtual {p0}, Ljava/lang/Throwable;->getCause()Ljava/lang/Throwable;

    .line 191
    .line 192
    .line 193
    move-result-object p0

    .line 194
    invoke-direct {v0, p0}, Ljava/lang/RuntimeException;-><init>(Ljava/lang/Throwable;)V

    .line 195
    .line 196
    .line 197
    throw v0

    .line 198
    :pswitch_8
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 199
    .line 200
    check-cast p0, Lok6;

    .line 201
    .line 202
    invoke-virtual {p0}, Lok6;->H0()Lnx5;

    .line 203
    .line 204
    .line 205
    move-result-object v0

    .line 206
    invoke-virtual {v0}, Lnx5;->zzg()V

    .line 207
    .line 208
    .line 209
    new-instance v0, Lhr3;

    .line 210
    .line 211
    invoke-direct {v0, p0}, Lhr3;-><init>(Lok6;)V

    .line 212
    .line 213
    .line 214
    iput-object v0, p0, Lok6;->M:Lhr3;

    .line 215
    .line 216
    new-instance v0, Lx53;

    .line 217
    .line 218
    invoke-direct {v0, p0}, Lx53;-><init>(Lok6;)V

    .line 219
    .line 220
    .line 221
    invoke-virtual {v0}, Loj6;->T1()V

    .line 222
    .line 223
    .line 224
    iput-object v0, p0, Lok6;->c:Lx53;

    .line 225
    .line 226
    iget-object v0, p0, Lok6;->a:Ljt5;

    .line 227
    .line 228
    invoke-virtual {p0}, Lok6;->d0()Ljw2;

    .line 229
    .line 230
    .line 231
    move-result-object v1

    .line 232
    invoke-static {v0}, Lmb6;->l(Ljava/lang/Object;)V

    .line 233
    .line 234
    .line 235
    iput-object v0, v1, Ljw2;->e:Lev2;

    .line 236
    .line 237
    new-instance v0, Lwg6;

    .line 238
    .line 239
    invoke-direct {v0, p0}, Lwg6;-><init>(Lok6;)V

    .line 240
    .line 241
    .line 242
    invoke-virtual {v0}, Loj6;->T1()V

    .line 243
    .line 244
    .line 245
    iput-object v0, p0, Lok6;->K:Lwg6;

    .line 246
    .line 247
    new-instance v0, Lri2;

    .line 248
    .line 249
    invoke-direct {v0, p0}, Loj6;-><init>(Lok6;)V

    .line 250
    .line 251
    .line 252
    invoke-virtual {v0}, Loj6;->T1()V

    .line 253
    .line 254
    .line 255
    iput-object v0, p0, Lok6;->f:Lri2;

    .line 256
    .line 257
    new-instance v0, Llg5;

    .line 258
    .line 259
    invoke-direct {v0, p0, v7}, Llg5;-><init>(Lok6;I)V

    .line 260
    .line 261
    .line 262
    invoke-virtual {v0}, Loj6;->T1()V

    .line 263
    .line 264
    .line 265
    iput-object v0, p0, Lok6;->J:Llg5;

    .line 266
    .line 267
    new-instance v0, Lwi6;

    .line 268
    .line 269
    invoke-direct {v0, p0}, Lwi6;-><init>(Lok6;)V

    .line 270
    .line 271
    .line 272
    invoke-virtual {v0}, Loj6;->T1()V

    .line 273
    .line 274
    .line 275
    iput-object v0, p0, Lok6;->e:Lwi6;

    .line 276
    .line 277
    new-instance v0, Loi5;

    .line 278
    .line 279
    invoke-direct {v0, p0}, Loi5;-><init>(Lok6;)V

    .line 280
    .line 281
    .line 282
    iput-object v0, p0, Lok6;->d:Loi5;

    .line 283
    .line 284
    iget v0, p0, Lok6;->T:I

    .line 285
    .line 286
    iget v1, p0, Lok6;->U:I

    .line 287
    .line 288
    if-eq v0, v1, :cond_3

    .line 289
    .line 290
    invoke-virtual {p0}, Lok6;->D()Lhd5;

    .line 291
    .line 292
    .line 293
    move-result-object v0

    .line 294
    iget-object v0, v0, Lhd5;->I:Lbp3;

    .line 295
    .line 296
    iget v1, p0, Lok6;->T:I

    .line 297
    .line 298
    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 299
    .line 300
    .line 301
    move-result-object v1

    .line 302
    iget v2, p0, Lok6;->U:I

    .line 303
    .line 304
    invoke-static {v2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 305
    .line 306
    .line 307
    move-result-object v2

    .line 308
    const-string v6, "Not all upload components initialized"

    .line 309
    .line 310
    invoke-virtual {v0, v1, v2, v6}, Lbp3;->g(Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/String;)V

    .line 311
    .line 312
    .line 313
    :cond_3
    iget-object v0, p0, Lok6;->O:Ljava/util/concurrent/atomic/AtomicBoolean;

    .line 314
    .line 315
    invoke-virtual {v0, v7}, Ljava/util/concurrent/atomic/AtomicBoolean;->set(Z)V

    .line 316
    .line 317
    .line 318
    invoke-virtual {p0}, Lok6;->D()Lhd5;

    .line 319
    .line 320
    .line 321
    move-result-object v0

    .line 322
    iget-object v0, v0, Lhd5;->Q:Lbp3;

    .line 323
    .line 324
    const-string v1, "UploadController is now fully initialized"

    .line 325
    .line 326
    invoke-virtual {v0, v1}, Lbp3;->e(Ljava/lang/String;)V

    .line 327
    .line 328
    .line 329
    invoke-virtual {p0}, Lok6;->H0()Lnx5;

    .line 330
    .line 331
    .line 332
    move-result-object v0

    .line 333
    invoke-virtual {v0}, Lnx5;->zzg()V

    .line 334
    .line 335
    .line 336
    iget-object v0, p0, Lok6;->c:Lx53;

    .line 337
    .line 338
    invoke-static {v0}, Lok6;->R(Loj6;)V

    .line 339
    .line 340
    .line 341
    invoke-virtual {v0}, Lx53;->W()V

    .line 342
    .line 343
    .line 344
    iget-object v0, p0, Lok6;->c:Lx53;

    .line 345
    .line 346
    invoke-static {v0}, Lok6;->R(Loj6;)V

    .line 347
    .line 348
    .line 349
    invoke-virtual {v0}, Li;->zzg()V

    .line 350
    .line 351
    .line 352
    invoke-virtual {v0}, Loj6;->S1()V

    .line 353
    .line 354
    .line 355
    invoke-virtual {v0}, Lx53;->D2()Z

    .line 356
    .line 357
    .line 358
    move-result v1

    .line 359
    if-eqz v1, :cond_5

    .line 360
    .line 361
    sget-object v1, Lp25;->u0:Lc25;

    .line 362
    .line 363
    invoke-virtual {v1, v5}, Lc25;->a(Ljava/lang/Object;)Ljava/lang/Object;

    .line 364
    .line 365
    .line 366
    move-result-object v2

    .line 367
    check-cast v2, Ljava/lang/Long;

    .line 368
    .line 369
    invoke-virtual {v2}, Ljava/lang/Long;->longValue()J

    .line 370
    .line 371
    .line 372
    move-result-wide v6

    .line 373
    cmp-long v2, v6, v3

    .line 374
    .line 375
    if-nez v2, :cond_4

    .line 376
    .line 377
    goto :goto_3

    .line 378
    :cond_4
    invoke-virtual {v0}, Lx53;->J2()Landroid/database/sqlite/SQLiteDatabase;

    .line 379
    .line 380
    .line 381
    move-result-object v2

    .line 382
    iget-object v0, v0, Li;->a:Ljava/lang/Object;

    .line 383
    .line 384
    check-cast v0, Lbz5;

    .line 385
    .line 386
    iget-object v6, v0, Lbz5;->M:Lwu;

    .line 387
    .line 388
    invoke-virtual {v6}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 389
    .line 390
    .line 391
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    .line 392
    .line 393
    .line 394
    move-result-wide v6

    .line 395
    invoke-static {v6, v7}, Ljava/lang/String;->valueOf(J)Ljava/lang/String;

    .line 396
    .line 397
    .line 398
    move-result-object v6

    .line 399
    invoke-virtual {v1, v5}, Lc25;->a(Ljava/lang/Object;)Ljava/lang/Object;

    .line 400
    .line 401
    .line 402
    move-result-object v1

    .line 403
    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    .line 404
    .line 405
    .line 406
    move-result-object v1

    .line 407
    filled-new-array {v6, v1}, [Ljava/lang/String;

    .line 408
    .line 409
    .line 410
    move-result-object v1

    .line 411
    const-string v5, "trigger_uris"

    .line 412
    .line 413
    const-string v6, "abs(timestamp_millis - ?) > cast(? as integer)"

    .line 414
    .line 415
    invoke-virtual {v2, v5, v6, v1}, Landroid/database/sqlite/SQLiteDatabase;->delete(Ljava/lang/String;Ljava/lang/String;[Ljava/lang/String;)I

    .line 416
    .line 417
    .line 418
    move-result v1

    .line 419
    if-lez v1, :cond_5

    .line 420
    .line 421
    iget-object v0, v0, Lbz5;->f:Lhd5;

    .line 422
    .line 423
    invoke-static {v0}, Lbz5;->h(Le76;)V

    .line 424
    .line 425
    .line 426
    iget-object v0, v0, Lhd5;->Q:Lbp3;

    .line 427
    .line 428
    const-string v2, "Deleted stale trigger uris. rowsDeleted"

    .line 429
    .line 430
    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 431
    .line 432
    .line 433
    move-result-object v1

    .line 434
    invoke-virtual {v0, v1, v2}, Lbp3;->f(Ljava/lang/Object;Ljava/lang/String;)V

    .line 435
    .line 436
    .line 437
    :cond_5
    :goto_3
    iget-object v0, p0, Lok6;->K:Lwg6;

    .line 438
    .line 439
    iget-object v0, v0, Lwg6;->K:Lmk5;

    .line 440
    .line 441
    invoke-virtual {v0}, Lmk5;->a()J

    .line 442
    .line 443
    .line 444
    move-result-wide v0

    .line 445
    cmp-long v0, v0, v3

    .line 446
    .line 447
    if-nez v0, :cond_6

    .line 448
    .line 449
    iget-object v0, p0, Lok6;->K:Lwg6;

    .line 450
    .line 451
    iget-object v0, v0, Lwg6;->K:Lmk5;

    .line 452
    .line 453
    invoke-virtual {p0}, Lok6;->U()Lwu;

    .line 454
    .line 455
    .line 456
    move-result-object v1

    .line 457
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 458
    .line 459
    .line 460
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    .line 461
    .line 462
    .line 463
    move-result-wide v1

    .line 464
    invoke-virtual {v0, v1, v2}, Lmk5;->b(J)V

    .line 465
    .line 466
    .line 467
    :cond_6
    invoke-virtual {p0}, Lok6;->K()V

    .line 468
    .line 469
    .line 470
    return-void

    .line 471
    :pswitch_9
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 472
    .line 473
    check-cast p0, Lqh6;

    .line 474
    .line 475
    iget-object v0, p0, Lqh6;->c:Lsh6;

    .line 476
    .line 477
    iget-object v0, v0, Lsh6;->c:Ljava/lang/Object;

    .line 478
    .line 479
    check-cast v0, Lci6;

    .line 480
    .line 481
    invoke-virtual {v0}, Lbs4;->zzg()V

    .line 482
    .line 483
    .line 484
    iget-object v1, v0, Li;->a:Ljava/lang/Object;

    .line 485
    .line 486
    check-cast v1, Lbz5;

    .line 487
    .line 488
    iget-object v2, v1, Lbz5;->f:Lhd5;

    .line 489
    .line 490
    iget-object v3, v1, Lbz5;->a:Landroid/content/Context;

    .line 491
    .line 492
    invoke-static {v2}, Lbz5;->h(Le76;)V

    .line 493
    .line 494
    .line 495
    iget-object v4, v2, Lhd5;->P:Lbp3;

    .line 496
    .line 497
    const-string v8, "Application going to the background"

    .line 498
    .line 499
    invoke-virtual {v4, v8}, Lbp3;->e(Ljava/lang/String;)V

    .line 500
    .line 501
    .line 502
    iget-object v4, v1, Lbz5;->e:Lzl5;

    .line 503
    .line 504
    invoke-static {v4}, Lbz5;->f(Li;)V

    .line 505
    .line 506
    .line 507
    iget-object v4, v4, Lzl5;->V:Lkj5;

    .line 508
    .line 509
    invoke-virtual {v4, v7}, Lkj5;->b(Z)V

    .line 510
    .line 511
    .line 512
    invoke-virtual {v0}, Lbs4;->zzg()V

    .line 513
    .line 514
    .line 515
    iput-boolean v7, v0, Lci6;->e:Z

    .line 516
    .line 517
    iget-object v4, v1, Lbz5;->d:Ljw2;

    .line 518
    .line 519
    invoke-virtual {v4}, Ljw2;->f2()Z

    .line 520
    .line 521
    .line 522
    move-result v8

    .line 523
    if-nez v8, :cond_7

    .line 524
    .line 525
    iget-wide v8, p0, Lqh6;->b:J

    .line 526
    .line 527
    iget-object v0, v0, Lci6;->I:Lqw2;

    .line 528
    .line 529
    invoke-virtual {v0, v8, v9, v6, v6}, Lqw2;->c(JZZ)Z

    .line 530
    .line 531
    .line 532
    iget-object v0, v0, Lqw2;->c:Ljava/lang/Object;

    .line 533
    .line 534
    check-cast v0, Luh6;

    .line 535
    .line 536
    invoke-virtual {v0}, Lj83;->c()V

    .line 537
    .line 538
    .line 539
    :cond_7
    iget-wide v8, p0, Lqh6;->a:J

    .line 540
    .line 541
    invoke-static {v2}, Lbz5;->h(Le76;)V

    .line 542
    .line 543
    .line 544
    iget-object p0, v2, Lhd5;->O:Lbp3;

    .line 545
    .line 546
    const-string v0, "Application backgrounded at: timestamp_millis"

    .line 547
    .line 548
    invoke-static {v8, v9}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 549
    .line 550
    .line 551
    move-result-object v6

    .line 552
    invoke-virtual {p0, v6, v0}, Lbp3;->f(Ljava/lang/Object;Ljava/lang/String;)V

    .line 553
    .line 554
    .line 555
    iget-object p0, v1, Lbz5;->O:Ltb6;

    .line 556
    .line 557
    invoke-static {p0}, Lbz5;->g(Lv35;)V

    .line 558
    .line 559
    .line 560
    invoke-virtual {p0}, Lbs4;->zzg()V

    .line 561
    .line 562
    .line 563
    iget-object v0, p0, Li;->a:Ljava/lang/Object;

    .line 564
    .line 565
    check-cast v0, Lbz5;

    .line 566
    .line 567
    invoke-virtual {p0}, Lv35;->S1()V

    .line 568
    .line 569
    .line 570
    invoke-virtual {v0}, Lbz5;->k()Lpg6;

    .line 571
    .line 572
    .line 573
    move-result-object p0

    .line 574
    invoke-virtual {p0}, Lbs4;->zzg()V

    .line 575
    .line 576
    .line 577
    invoke-virtual {p0}, Lv35;->S1()V

    .line 578
    .line 579
    .line 580
    invoke-virtual {p0}, Lpg6;->X1()Z

    .line 581
    .line 582
    .line 583
    move-result v6

    .line 584
    if-nez v6, :cond_8

    .line 585
    .line 586
    goto :goto_4

    .line 587
    :cond_8
    iget-object p0, p0, Li;->a:Ljava/lang/Object;

    .line 588
    .line 589
    check-cast p0, Lbz5;

    .line 590
    .line 591
    iget-object p0, p0, Lbz5;->K:Lbl6;

    .line 592
    .line 593
    invoke-static {p0}, Lbz5;->f(Li;)V

    .line 594
    .line 595
    .line 596
    invoke-virtual {p0}, Lbl6;->E2()I

    .line 597
    .line 598
    .line 599
    move-result p0

    .line 600
    const v6, 0x3b3a8

    .line 601
    .line 602
    .line 603
    if-lt p0, v6, :cond_9

    .line 604
    .line 605
    :goto_4
    invoke-virtual {v0}, Lbz5;->k()Lpg6;

    .line 606
    .line 607
    .line 608
    move-result-object p0

    .line 609
    invoke-virtual {p0}, Lbs4;->zzg()V

    .line 610
    .line 611
    .line 612
    invoke-virtual {p0}, Lv35;->S1()V

    .line 613
    .line 614
    .line 615
    invoke-virtual {p0, v7}, Lpg6;->g2(Z)Lpn6;

    .line 616
    .line 617
    .line 618
    move-result-object v0

    .line 619
    new-instance v6, Lee6;

    .line 620
    .line 621
    invoke-direct {v6, p0, v0, v7}, Lee6;-><init>(Lpg6;Lpn6;I)V

    .line 622
    .line 623
    .line 624
    invoke-virtual {p0, v6}, Lpg6;->e2(Ljava/lang/Runnable;)V

    .line 625
    .line 626
    .line 627
    :cond_9
    sget-object p0, Lp25;->N0:Lc25;

    .line 628
    .line 629
    invoke-virtual {v4, v5, p0}, Ljw2;->b2(Ljava/lang/String;Lc25;)Z

    .line 630
    .line 631
    .line 632
    move-result p0

    .line 633
    if-eqz p0, :cond_b

    .line 634
    .line 635
    iget-object p0, v1, Lbz5;->K:Lbl6;

    .line 636
    .line 637
    invoke-static {p0}, Lbz5;->f(Li;)V

    .line 638
    .line 639
    .line 640
    invoke-virtual {v3}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    .line 641
    .line 642
    .line 643
    move-result-object v0

    .line 644
    iget-object v5, v4, Ljw2;->d:Ljava/lang/String;

    .line 645
    .line 646
    invoke-virtual {p0, v0, v5}, Lbl6;->w2(Ljava/lang/String;Ljava/lang/String;)Z

    .line 647
    .line 648
    .line 649
    move-result p0

    .line 650
    if-eqz p0, :cond_a

    .line 651
    .line 652
    const-wide/16 v3, 0x3e8

    .line 653
    .line 654
    goto :goto_5

    .line 655
    :cond_a
    invoke-virtual {v3}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    .line 656
    .line 657
    .line 658
    move-result-object p0

    .line 659
    sget-object v0, Lp25;->E:Lc25;

    .line 660
    .line 661
    invoke-virtual {v4, p0, v0}, Ljw2;->Y1(Ljava/lang/String;Lc25;)J

    .line 662
    .line 663
    .line 664
    move-result-wide v3

    .line 665
    :goto_5
    invoke-static {v2}, Lbz5;->h(Le76;)V

    .line 666
    .line 667
    .line 668
    iget-object p0, v2, Lhd5;->Q:Lbp3;

    .line 669
    .line 670
    const-string v0, "[sgtm] Scheduling batch upload with minimum latency in millis"

    .line 671
    .line 672
    invoke-static {v3, v4}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    .line 673
    .line 674
    .line 675
    move-result-object v2

    .line 676
    invoke-virtual {p0, v2, v0}, Lbp3;->f(Ljava/lang/Object;Ljava/lang/String;)V

    .line 677
    .line 678
    .line 679
    iget-object p0, v1, Lbz5;->W:Lic6;

    .line 680
    .line 681
    invoke-static {p0}, Lbz5;->e(Lbs4;)V

    .line 682
    .line 683
    .line 684
    iget-object p0, v1, Lbz5;->W:Lic6;

    .line 685
    .line 686
    invoke-virtual {p0, v3, v4}, Lic6;->V1(J)V

    .line 687
    .line 688
    .line 689
    :cond_b
    return-void

    .line 690
    :pswitch_a
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 691
    .line 692
    check-cast p0, Lfl6;

    .line 693
    .line 694
    invoke-virtual {p0}, Lfl6;->i()Lch6;

    .line 695
    .line 696
    .line 697
    move-result-object v0

    .line 698
    new-instance v1, Lsi6;

    .line 699
    .line 700
    const/16 v2, 0xc

    .line 701
    .line 702
    invoke-direct {v1, v2}, Lsi6;-><init>(I)V

    .line 703
    .line 704
    .line 705
    const/16 v2, 0x404

    .line 706
    .line 707
    invoke-virtual {p0, v0, v2, v1}, Lfl6;->h(Lch6;ILyh4;)V

    .line 708
    .line 709
    .line 710
    iget-object p0, p0, Lfl6;->f:Lyj4;

    .line 711
    .line 712
    invoke-virtual {p0}, Lyj4;->e()V

    .line 713
    .line 714
    .line 715
    return-void

    .line 716
    :pswitch_b
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 717
    .line 718
    check-cast p0, Lyx5;

    .line 719
    .line 720
    iget-object p0, p0, Lyx5;->c:Ljava/lang/Object;

    .line 721
    .line 722
    check-cast p0, Ldg6;

    .line 723
    .line 724
    iget-object p0, p0, Ldg6;->c:Lpg6;

    .line 725
    .line 726
    iget-object v0, p0, Li;->a:Ljava/lang/Object;

    .line 727
    .line 728
    check-cast v0, Lbz5;

    .line 729
    .line 730
    iget-object v0, v0, Lbz5;->I:Lnx5;

    .line 731
    .line 732
    invoke-static {v0}, Lbz5;->h(Le76;)V

    .line 733
    .line 734
    .line 735
    new-instance v1, Lbg6;

    .line 736
    .line 737
    invoke-direct {v1, p0, v6}, Lbg6;-><init>(Lpg6;I)V

    .line 738
    .line 739
    .line 740
    invoke-virtual {v0, v1}, Lnx5;->a2(Ljava/lang/Runnable;)V

    .line 741
    .line 742
    .line 743
    return-void

    .line 744
    :pswitch_c
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 745
    .line 746
    check-cast p0, Ldg6;

    .line 747
    .line 748
    iget-object p0, p0, Ldg6;->c:Lpg6;

    .line 749
    .line 750
    new-instance v0, Landroid/content/ComponentName;

    .line 751
    .line 752
    iget-object v1, p0, Li;->a:Ljava/lang/Object;

    .line 753
    .line 754
    check-cast v1, Lbz5;

    .line 755
    .line 756
    iget-object v1, v1, Lbz5;->a:Landroid/content/Context;

    .line 757
    .line 758
    const-string v2, "com.google.android.gms.measurement.AppMeasurementService"

    .line 759
    .line 760
    invoke-direct {v0, v1, v2}, Landroid/content/ComponentName;-><init>(Landroid/content/Context;Ljava/lang/String;)V

    .line 761
    .line 762
    .line 763
    invoke-virtual {p0, v0}, Lpg6;->b2(Landroid/content/ComponentName;)V

    .line 764
    .line 765
    .line 766
    return-void

    .line 767
    :pswitch_d
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 768
    .line 769
    check-cast p0, Lnf6;

    .line 770
    .line 771
    :try_start_3
    monitor-enter p0

    .line 772
    monitor-exit p0
    :try_end_3
    .catch Lw76; {:try_start_3 .. :try_end_3} :catch_3

    .line 773
    :try_start_4
    iget-object v0, p0, Lnf6;->a:Lkf6;

    .line 774
    .line 775
    iget v1, p0, Lnf6;->c:I

    .line 776
    .line 777
    iget-object v2, p0, Lnf6;->d:Ljava/lang/Object;

    .line 778
    .line 779
    invoke-interface {v0, v1, v2}, Lkf6;->b(ILjava/lang/Object;)V
    :try_end_4
    .catchall {:try_start_4 .. :try_end_4} :catchall_0

    .line 780
    .line 781
    .line 782
    :try_start_5
    invoke-virtual {p0, v7}, Lnf6;->b(Z)V

    .line 783
    .line 784
    .line 785
    goto :goto_6

    .line 786
    :catchall_0
    move-exception v0

    .line 787
    invoke-virtual {p0, v7}, Lnf6;->b(Z)V

    .line 788
    .line 789
    .line 790
    throw v0
    :try_end_5
    .catch Lw76; {:try_start_5 .. :try_end_5} :catch_3

    .line 791
    :catch_3
    move-exception p0

    .line 792
    const-string v0, "ExoPlayerImplInternal"

    .line 793
    .line 794
    const-string v1, "Unexpected error delivering message on external thread."

    .line 795
    .line 796
    invoke-static {v0, v1, p0}, Lht3;->U(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 797
    .line 798
    .line 799
    invoke-static {p0}, Ldw1;->p(Ljava/lang/Throwable;)V

    .line 800
    .line 801
    .line 802
    :goto_6
    return-void

    .line 803
    :pswitch_e
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 804
    .line 805
    check-cast p0, Luc6;

    .line 806
    .line 807
    iget-object p0, p0, Luc6;->X:Lfl6;

    .line 808
    .line 809
    invoke-virtual {p0}, Lfl6;->i()Lch6;

    .line 810
    .line 811
    .line 812
    move-result-object v0

    .line 813
    new-instance v1, Lqi6;

    .line 814
    .line 815
    invoke-direct {v1, v6}, Lqi6;-><init>(I)V

    .line 816
    .line 817
    .line 818
    const/16 v2, 0x40a

    .line 819
    .line 820
    invoke-virtual {p0, v0, v2, v1}, Lfl6;->h(Lch6;ILyh4;)V

    .line 821
    .line 822
    .line 823
    return-void

    .line 824
    :pswitch_f
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 825
    .line 826
    check-cast p0, Lub6;

    .line 827
    .line 828
    sget-object v0, Lxw4;->a:Ljava/lang/String;

    .line 829
    .line 830
    iget-object v0, p0, Lub6;->f:Landroid/content/Context;

    .line 831
    .line 832
    invoke-static {v0}, Lkx3;->N(Landroid/content/Context;)Landroid/media/AudioManager;

    .line 833
    .line 834
    .line 835
    move-result-object v0

    .line 836
    invoke-virtual {v0}, Landroid/media/AudioManager;->generateAudioSessionId()I

    .line 837
    .line 838
    .line 839
    move-result v0

    .line 840
    const/4 v2, -0x1

    .line 841
    if-ne v0, v2, :cond_c

    .line 842
    .line 843
    move v0, v6

    .line 844
    :cond_c
    iget-object v2, p0, Lub6;->d0:Lmp5;

    .line 845
    .line 846
    iget-object v3, v2, Lmp5;->c:Ljava/lang/Object;

    .line 847
    .line 848
    check-cast v3, Lru4;

    .line 849
    .line 850
    invoke-static {}, Landroid/os/Looper;->myLooper()Landroid/os/Looper;

    .line 851
    .line 852
    .line 853
    move-result-object v4

    .line 854
    iget-object v3, v3, Lru4;->a:Landroid/os/Handler;

    .line 855
    .line 856
    invoke-virtual {v3}, Landroid/os/Handler;->getLooper()Landroid/os/Looper;

    .line 857
    .line 858
    .line 859
    move-result-object v3

    .line 860
    if-ne v4, v3, :cond_d

    .line 861
    .line 862
    iget-object v3, v2, Lmp5;->e:Ljava/lang/Object;

    .line 863
    .line 864
    goto :goto_7

    .line 865
    :cond_d
    iget-object v3, v2, Lmp5;->b:Ljava/lang/Object;

    .line 866
    .line 867
    check-cast v3, Lru4;

    .line 868
    .line 869
    iget-object v3, v3, Lru4;->a:Landroid/os/Handler;

    .line 870
    .line 871
    invoke-virtual {v3}, Landroid/os/Handler;->getLooper()Landroid/os/Looper;

    .line 872
    .line 873
    .line 874
    move-result-object v3

    .line 875
    if-ne v4, v3, :cond_e

    .line 876
    .line 877
    move v6, v7

    .line 878
    :cond_e
    invoke-static {v6}, Lg06;->F(Z)V

    .line 879
    .line 880
    .line 881
    iget-object v3, v2, Lmp5;->f:Ljava/lang/Object;

    .line 882
    .line 883
    :goto_7
    check-cast v3, Ljava/lang/Integer;

    .line 884
    .line 885
    invoke-virtual {v3}, Ljava/lang/Integer;->intValue()I

    .line 886
    .line 887
    .line 888
    move-result v3

    .line 889
    if-eq v3, v0, :cond_10

    .line 890
    .line 891
    invoke-static {v0}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    .line 892
    .line 893
    .line 894
    move-result-object v0

    .line 895
    iput-object v0, v2, Lmp5;->f:Ljava/lang/Object;

    .line 896
    .line 897
    new-instance v3, Lmn3;

    .line 898
    .line 899
    const/16 v4, 0xb

    .line 900
    .line 901
    invoke-direct {v3, v4, v2, v0}, Lmn3;-><init>(ILjava/lang/Object;Ljava/lang/Object;)V

    .line 902
    .line 903
    .line 904
    iget-object v2, v2, Lmp5;->c:Ljava/lang/Object;

    .line 905
    .line 906
    check-cast v2, Lru4;

    .line 907
    .line 908
    iget-object v4, v2, Lru4;->a:Landroid/os/Handler;

    .line 909
    .line 910
    invoke-virtual {v4}, Landroid/os/Handler;->getLooper()Landroid/os/Looper;

    .line 911
    .line 912
    .line 913
    move-result-object v4

    .line 914
    invoke-virtual {v4}, Landroid/os/Looper;->getThread()Ljava/lang/Thread;

    .line 915
    .line 916
    .line 917
    move-result-object v4

    .line 918
    invoke-virtual {v4}, Ljava/lang/Thread;->isAlive()Z

    .line 919
    .line 920
    .line 921
    move-result v4

    .line 922
    if-nez v4, :cond_f

    .line 923
    .line 924
    goto :goto_8

    .line 925
    :cond_f
    invoke-virtual {v2, v3}, Lru4;->e(Ljava/lang/Runnable;)V

    .line 926
    .line 927
    .line 928
    :goto_8
    const/16 v2, 0xa

    .line 929
    .line 930
    invoke-virtual {p0, v7, v0, v2}, Lub6;->h2(ILjava/lang/Object;I)V

    .line 931
    .line 932
    .line 933
    invoke-virtual {p0, v1, v0, v2}, Lub6;->h2(ILjava/lang/Object;I)V

    .line 934
    .line 935
    .line 936
    :cond_10
    return-void

    .line 937
    :pswitch_10
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 938
    .line 939
    check-cast p0, Lxa6;

    .line 940
    .line 941
    iget-object p0, p0, Lxa6;->b:Ljava/lang/Object;

    .line 942
    .line 943
    check-cast p0, Landroid/content/Context;

    .line 944
    .line 945
    invoke-static {p0}, Lxa6;->G(Landroid/content/Context;)Landroid/content/SharedPreferences;

    .line 946
    .line 947
    .line 948
    move-result-object v0

    .line 949
    const-string v1, "app_set_id_last_used_time"

    .line 950
    .line 951
    const-wide/16 v2, -0x1

    .line 952
    .line 953
    invoke-interface {v0, v1, v2, v3}, Landroid/content/SharedPreferences;->getLong(Ljava/lang/String;J)J

    .line 954
    .line 955
    .line 956
    move-result-wide v4

    .line 957
    cmp-long v0, v4, v2

    .line 958
    .line 959
    if-eqz v0, :cond_11

    .line 960
    .line 961
    const-wide v7, 0x7d8702800L

    .line 962
    .line 963
    .line 964
    .line 965
    .line 966
    add-long/2addr v4, v7

    .line 967
    goto :goto_9

    .line 968
    :cond_11
    move-wide v4, v2

    .line 969
    :goto_9
    cmp-long v0, v4, v2

    .line 970
    .line 971
    if-eqz v0, :cond_15

    .line 972
    .line 973
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    .line 974
    .line 975
    .line 976
    move-result-wide v2

    .line 977
    cmp-long v0, v2, v4

    .line 978
    .line 979
    if-lez v0, :cond_15

    .line 980
    .line 981
    const-string v0, "AppSet"

    .line 982
    .line 983
    invoke-static {p0}, Lxa6;->G(Landroid/content/Context;)Landroid/content/SharedPreferences;

    .line 984
    .line 985
    .line 986
    move-result-object v2

    .line 987
    invoke-interface {v2}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    .line 988
    .line 989
    .line 990
    move-result-object v2

    .line 991
    const-string v3, "app_set_id"

    .line 992
    .line 993
    invoke-interface {v2, v3}, Landroid/content/SharedPreferences$Editor;->remove(Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    .line 994
    .line 995
    .line 996
    move-result-object v2

    .line 997
    invoke-interface {v2}, Landroid/content/SharedPreferences$Editor;->commit()Z

    .line 998
    .line 999
    .line 1000
    move-result v2

    .line 1001
    if-nez v2, :cond_13

    .line 1002
    .line 1003
    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    .line 1004
    .line 1005
    .line 1006
    move-result-object v2

    .line 1007
    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    .line 1008
    .line 1009
    .line 1010
    move-result-object v2

    .line 1011
    const-string v3, "Failed to clear app set ID generated for App "

    .line 1012
    .line 1013
    invoke-virtual {v2}, Ljava/lang/String;->length()I

    .line 1014
    .line 1015
    .line 1016
    move-result v4

    .line 1017
    if-eqz v4, :cond_12

    .line 1018
    .line 1019
    invoke-virtual {v3, v2}, Ljava/lang/String;->concat(Ljava/lang/String;)Ljava/lang/String;

    .line 1020
    .line 1021
    .line 1022
    move-result-object v2

    .line 1023
    goto :goto_a

    .line 1024
    :cond_12
    new-instance v2, Ljava/lang/String;

    .line 1025
    .line 1026
    invoke-direct {v2, v3}, Ljava/lang/String;-><init>(Ljava/lang/String;)V

    .line 1027
    .line 1028
    .line 1029
    :goto_a
    invoke-static {v0, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1030
    .line 1031
    .line 1032
    :cond_13
    const-string v2, "app_set_id_storage"

    .line 1033
    .line 1034
    invoke-virtual {p0, v2, v6}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    .line 1035
    .line 1036
    .line 1037
    move-result-object v2

    .line 1038
    invoke-interface {v2}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    .line 1039
    .line 1040
    .line 1041
    move-result-object v2

    .line 1042
    invoke-interface {v2, v1}, Landroid/content/SharedPreferences$Editor;->remove(Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    .line 1043
    .line 1044
    .line 1045
    move-result-object v1

    .line 1046
    invoke-interface {v1}, Landroid/content/SharedPreferences$Editor;->commit()Z

    .line 1047
    .line 1048
    .line 1049
    move-result v1

    .line 1050
    if-nez v1, :cond_15

    .line 1051
    .line 1052
    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    .line 1053
    .line 1054
    .line 1055
    move-result-object p0

    .line 1056
    invoke-static {p0}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    .line 1057
    .line 1058
    .line 1059
    move-result-object p0

    .line 1060
    const-string v1, "Failed to clear app set ID last used time for App "

    .line 1061
    .line 1062
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    .line 1063
    .line 1064
    .line 1065
    move-result v2

    .line 1066
    if-eqz v2, :cond_14

    .line 1067
    .line 1068
    invoke-virtual {v1, p0}, Ljava/lang/String;->concat(Ljava/lang/String;)Ljava/lang/String;

    .line 1069
    .line 1070
    .line 1071
    move-result-object p0

    .line 1072
    goto :goto_b

    .line 1073
    :cond_14
    new-instance p0, Ljava/lang/String;

    .line 1074
    .line 1075
    invoke-direct {p0, v1}, Ljava/lang/String;-><init>(Ljava/lang/String;)V

    .line 1076
    .line 1077
    .line 1078
    :goto_b
    invoke-static {v0, p0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 1079
    .line 1080
    .line 1081
    :cond_15
    return-void

    .line 1082
    :pswitch_11
    const-string v0, "Timed out (timeout delayed by "

    .line 1083
    .line 1084
    const-string v2, ": "

    .line 1085
    .line 1086
    const-string v3, " ms after scheduled time)"

    .line 1087
    .line 1088
    iget-object v4, p0, La25;->b:Ljava/lang/Object;

    .line 1089
    .line 1090
    check-cast v4, Lyj5;

    .line 1091
    .line 1092
    if-nez v4, :cond_16

    .line 1093
    .line 1094
    goto/16 :goto_f

    .line 1095
    .line 1096
    :cond_16
    iget-object v6, v4, Lyj5;->J:Lcom/google/common/util/concurrent/ListenableFuture;

    .line 1097
    .line 1098
    if-eqz v6, :cond_19

    .line 1099
    .line 1100
    iput-object v5, p0, La25;->b:Ljava/lang/Object;

    .line 1101
    .line 1102
    invoke-interface {v6}, Ljava/util/concurrent/Future;->isDone()Z

    .line 1103
    .line 1104
    .line 1105
    move-result p0

    .line 1106
    if-eqz p0, :cond_17

    .line 1107
    .line 1108
    invoke-virtual {v4, v6}, Ldi5;->m(Lcom/google/common/util/concurrent/ListenableFuture;)V

    .line 1109
    .line 1110
    .line 1111
    goto :goto_f

    .line 1112
    :cond_17
    :try_start_6
    iget-object p0, v4, Lyj5;->K:Ljava/util/concurrent/ScheduledFuture;

    .line 1113
    .line 1114
    iput-object v5, v4, Lyj5;->K:Ljava/util/concurrent/ScheduledFuture;

    .line 1115
    .line 1116
    const-string v5, "Timed out"
    :try_end_6
    .catchall {:try_start_6 .. :try_end_6} :catchall_2

    .line 1117
    .line 1118
    if-eqz p0, :cond_18

    .line 1119
    .line 1120
    :try_start_7
    sget-object v8, Ljava/util/concurrent/TimeUnit;->MILLISECONDS:Ljava/util/concurrent/TimeUnit;

    .line 1121
    .line 1122
    invoke-interface {p0, v8}, Ljava/util/concurrent/Delayed;->getDelay(Ljava/util/concurrent/TimeUnit;)J

    .line 1123
    .line 1124
    .line 1125
    move-result-wide v8

    .line 1126
    invoke-static {v8, v9}, Ljava/lang/Math;->abs(J)J

    .line 1127
    .line 1128
    .line 1129
    move-result-wide v8

    .line 1130
    const-wide/16 v10, 0xa

    .line 1131
    .line 1132
    cmp-long p0, v8, v10

    .line 1133
    .line 1134
    if-lez p0, :cond_18

    .line 1135
    .line 1136
    invoke-static {v8, v9}, Ljava/lang/String;->valueOf(J)Ljava/lang/String;

    .line 1137
    .line 1138
    .line 1139
    move-result-object p0

    .line 1140
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    .line 1141
    .line 1142
    .line 1143
    move-result p0

    .line 1144
    add-int/lit8 p0, p0, 0x37

    .line 1145
    .line 1146
    new-instance v10, Ljava/lang/StringBuilder;

    .line 1147
    .line 1148
    invoke-direct {v10, p0}, Ljava/lang/StringBuilder;-><init>(I)V

    .line 1149
    .line 1150
    .line 1151
    invoke-virtual {v10, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1152
    .line 1153
    .line 1154
    invoke-virtual {v10, v8, v9}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    .line 1155
    .line 1156
    .line 1157
    invoke-virtual {v10, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1158
    .line 1159
    .line 1160
    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 1161
    .line 1162
    .line 1163
    move-result-object v5

    .line 1164
    goto :goto_c

    .line 1165
    :catchall_1
    move-exception p0

    .line 1166
    goto :goto_d

    .line 1167
    :cond_18
    :goto_c
    invoke-virtual {v6}, Ljava/lang/Object;->toString()Ljava/lang/String;

    .line 1168
    .line 1169
    .line 1170
    move-result-object p0

    .line 1171
    invoke-virtual {v5}, Ljava/lang/String;->length()I

    .line 1172
    .line 1173
    .line 1174
    move-result v0

    .line 1175
    add-int/2addr v0, v1

    .line 1176
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    .line 1177
    .line 1178
    .line 1179
    move-result v1

    .line 1180
    add-int/2addr v0, v1

    .line 1181
    new-instance v1, Ljava/lang/StringBuilder;

    .line 1182
    .line 1183
    invoke-direct {v1, v0}, Ljava/lang/StringBuilder;-><init>(I)V

    .line 1184
    .line 1185
    .line 1186
    invoke-virtual {v1, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1187
    .line 1188
    .line 1189
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1190
    .line 1191
    .line 1192
    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1193
    .line 1194
    .line 1195
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    .line 1196
    .line 1197
    .line 1198
    move-result-object p0
    :try_end_7
    .catchall {:try_start_7 .. :try_end_7} :catchall_1

    .line 1199
    :try_start_8
    new-instance v0, Lxj5;

    .line 1200
    .line 1201
    invoke-direct {v0, p0}, Ljava/util/concurrent/TimeoutException;-><init>(Ljava/lang/String;)V

    .line 1202
    .line 1203
    .line 1204
    invoke-virtual {v4, v0}, Ldi5;->d(Ljava/lang/Throwable;)Z
    :try_end_8
    .catchall {:try_start_8 .. :try_end_8} :catchall_2

    .line 1205
    .line 1206
    .line 1207
    invoke-interface {v6, v7}, Ljava/util/concurrent/Future;->cancel(Z)Z

    .line 1208
    .line 1209
    .line 1210
    goto :goto_f

    .line 1211
    :catchall_2
    move-exception p0

    .line 1212
    goto :goto_e

    .line 1213
    :goto_d
    :try_start_9
    new-instance v0, Lxj5;

    .line 1214
    .line 1215
    invoke-direct {v0, v5}, Ljava/util/concurrent/TimeoutException;-><init>(Ljava/lang/String;)V

    .line 1216
    .line 1217
    .line 1218
    invoke-virtual {v4, v0}, Ldi5;->d(Ljava/lang/Throwable;)Z

    .line 1219
    .line 1220
    .line 1221
    throw p0
    :try_end_9
    .catchall {:try_start_9 .. :try_end_9} :catchall_2

    .line 1222
    :goto_e
    invoke-interface {v6, v7}, Ljava/util/concurrent/Future;->cancel(Z)Z

    .line 1223
    .line 1224
    .line 1225
    throw p0

    .line 1226
    :cond_19
    :goto_f
    return-void

    .line 1227
    :pswitch_12
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1228
    .line 1229
    check-cast p0, Loi5;

    .line 1230
    .line 1231
    iget-object p0, p0, Loi5;->a:Lok6;

    .line 1232
    .line 1233
    invoke-virtual {p0}, Lok6;->K()V

    .line 1234
    .line 1235
    .line 1236
    return-void

    .line 1237
    :pswitch_13
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1238
    .line 1239
    check-cast p0, Lo66;

    .line 1240
    .line 1241
    iget-boolean v0, p0, Lo66;->b:Z

    .line 1242
    .line 1243
    if-nez v0, :cond_1a

    .line 1244
    .line 1245
    goto :goto_11

    .line 1246
    :cond_1a
    invoke-virtual {p0}, Lo66;->l()Z

    .line 1247
    .line 1248
    .line 1249
    move-result v0

    .line 1250
    if-eqz v0, :cond_1b

    .line 1251
    .line 1252
    invoke-virtual {p0}, Lo66;->m()Z

    .line 1253
    .line 1254
    .line 1255
    move-result v0

    .line 1256
    if-eqz v0, :cond_1b

    .line 1257
    .line 1258
    goto :goto_11

    .line 1259
    :cond_1b
    sget-object v0, Lwh3;->b:Ln43;

    .line 1260
    .line 1261
    invoke-virtual {v0}, Ln43;->F()Ljava/lang/Object;

    .line 1262
    .line 1263
    .line 1264
    move-result-object v0

    .line 1265
    check-cast v0, Ljava/lang/Boolean;

    .line 1266
    .line 1267
    invoke-virtual {v0}, Ljava/lang/Boolean;->booleanValue()Z

    .line 1268
    .line 1269
    .line 1270
    move-result v0

    .line 1271
    if-nez v0, :cond_1c

    .line 1272
    .line 1273
    goto :goto_11

    .line 1274
    :cond_1c
    iget-object v0, p0, Lo66;->a:Ljava/lang/Object;

    .line 1275
    .line 1276
    monitor-enter v0

    .line 1277
    :try_start_a
    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    .line 1278
    .line 1279
    .line 1280
    move-result-object v1

    .line 1281
    if-nez v1, :cond_1d

    .line 1282
    .line 1283
    monitor-exit v0

    .line 1284
    goto :goto_11

    .line 1285
    :catchall_3
    move-exception p0

    .line 1286
    goto :goto_13

    .line 1287
    :cond_1d
    iget-object v1, p0, Lo66;->e:Lid3;

    .line 1288
    .line 1289
    if-nez v1, :cond_1e

    .line 1290
    .line 1291
    new-instance v1, Lid3;

    .line 1292
    .line 1293
    invoke-direct {v1}, Lid3;-><init>()V

    .line 1294
    .line 1295
    .line 1296
    iput-object v1, p0, Lo66;->e:Lid3;

    .line 1297
    .line 1298
    :cond_1e
    iget-object p0, p0, Lo66;->e:Lid3;

    .line 1299
    .line 1300
    iget-object v1, p0, Lid3;->c:Ljava/lang/Object;

    .line 1301
    .line 1302
    monitor-enter v1
    :try_end_a
    .catchall {:try_start_a .. :try_end_a} :catchall_3

    .line 1303
    :try_start_b
    iget-boolean v2, p0, Lid3;->a:Z

    .line 1304
    .line 1305
    if-eqz v2, :cond_1f

    .line 1306
    .line 1307
    const-string p0, "Content hash thread already started, quitting..."

    .line 1308
    .line 1309
    sget v2, Lkh4;->b:I

    .line 1310
    .line 1311
    invoke-static {p0}, Lkh4;->d(Ljava/lang/String;)V

    .line 1312
    .line 1313
    .line 1314
    monitor-exit v1

    .line 1315
    goto :goto_10

    .line 1316
    :catchall_4
    move-exception p0

    .line 1317
    goto :goto_12

    .line 1318
    :cond_1f
    iput-boolean v7, p0, Lid3;->a:Z

    .line 1319
    .line 1320
    monitor-exit v1
    :try_end_b
    .catchall {:try_start_b .. :try_end_b} :catchall_4

    .line 1321
    :try_start_c
    invoke-virtual {p0}, Ljava/lang/Thread;->start()V

    .line 1322
    .line 1323
    .line 1324
    :goto_10
    const-string p0, "start fetching content..."

    .line 1325
    .line 1326
    sget v1, Lkh4;->b:I

    .line 1327
    .line 1328
    invoke-static {p0}, Lkh4;->h(Ljava/lang/String;)V

    .line 1329
    .line 1330
    .line 1331
    monitor-exit v0
    :try_end_c
    .catchall {:try_start_c .. :try_end_c} :catchall_3

    .line 1332
    :goto_11
    return-void

    .line 1333
    :goto_12
    :try_start_d
    monitor-exit v1
    :try_end_d
    .catchall {:try_start_d .. :try_end_d} :catchall_4

    .line 1334
    :try_start_e
    throw p0

    .line 1335
    :goto_13
    monitor-exit v0
    :try_end_e
    .catchall {:try_start_e .. :try_end_e} :catchall_3

    .line 1336
    throw p0

    .line 1337
    :pswitch_14
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1338
    .line 1339
    check-cast p0, Lan4;

    .line 1340
    .line 1341
    iget-object v0, p0, Lan4;->L:Ljava/lang/Object;

    .line 1342
    .line 1343
    check-cast v0, Lvb5;

    .line 1344
    .line 1345
    if-eqz v0, :cond_20

    .line 1346
    .line 1347
    iget-object v0, p0, Lan4;->d:Ljava/lang/Object;

    .line 1348
    .line 1349
    check-cast v0, Lqu4;

    .line 1350
    .line 1351
    const-string v1, "Unbind from service."

    .line 1352
    .line 1353
    new-array v2, v6, [Ljava/lang/Object;

    .line 1354
    .line 1355
    invoke-virtual {v0, v1, v2}, Lqu4;->b(Ljava/lang/String;[Ljava/lang/Object;)V

    .line 1356
    .line 1357
    .line 1358
    iget-object v0, p0, Lan4;->b:Ljava/lang/Object;

    .line 1359
    .line 1360
    check-cast v0, Landroid/content/Context;

    .line 1361
    .line 1362
    iget-object v1, p0, Lan4;->K:Ljava/lang/Object;

    .line 1363
    .line 1364
    check-cast v1, Lp92;

    .line 1365
    .line 1366
    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 1367
    .line 1368
    .line 1369
    invoke-virtual {v0, v1}, Landroid/content/Context;->unbindService(Landroid/content/ServiceConnection;)V

    .line 1370
    .line 1371
    .line 1372
    iput-boolean v6, p0, Lan4;->a:Z

    .line 1373
    .line 1374
    iput-object v5, p0, Lan4;->L:Ljava/lang/Object;

    .line 1375
    .line 1376
    iput-object v5, p0, Lan4;->K:Ljava/lang/Object;

    .line 1377
    .line 1378
    iget-object p0, p0, Lan4;->f:Ljava/lang/Object;

    .line 1379
    .line 1380
    check-cast p0, Ljava/util/ArrayList;

    .line 1381
    .line 1382
    monitor-enter p0

    .line 1383
    :try_start_f
    invoke-virtual {p0}, Ljava/util/ArrayList;->clear()V

    .line 1384
    .line 1385
    .line 1386
    monitor-exit p0

    .line 1387
    goto :goto_14

    .line 1388
    :catchall_5
    move-exception v0

    .line 1389
    monitor-exit p0
    :try_end_f
    .catchall {:try_start_f .. :try_end_f} :catchall_5

    .line 1390
    throw v0

    .line 1391
    :cond_20
    :goto_14
    return-void

    .line 1392
    :pswitch_15
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1393
    .line 1394
    check-cast p0, Lp92;

    .line 1395
    .line 1396
    iget-object p0, p0, Lp92;->b:Ljava/lang/Object;

    .line 1397
    .line 1398
    check-cast p0, Lan4;

    .line 1399
    .line 1400
    iget-object v0, p0, Lan4;->d:Ljava/lang/Object;

    .line 1401
    .line 1402
    check-cast v0, Lqu4;

    .line 1403
    .line 1404
    const-string v1, "unlinkToDeath"

    .line 1405
    .line 1406
    new-array v2, v6, [Ljava/lang/Object;

    .line 1407
    .line 1408
    invoke-virtual {v0, v1, v2}, Lqu4;->b(Ljava/lang/String;[Ljava/lang/Object;)V

    .line 1409
    .line 1410
    .line 1411
    iget-object v0, p0, Lan4;->L:Ljava/lang/Object;

    .line 1412
    .line 1413
    check-cast v0, Lvb5;

    .line 1414
    .line 1415
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 1416
    .line 1417
    .line 1418
    check-cast v0, Lm92;

    .line 1419
    .line 1420
    iget-object v0, v0, Lm92;->b:Landroid/os/IBinder;

    .line 1421
    .line 1422
    iget-object v1, p0, Lan4;->J:Ljava/lang/Object;

    .line 1423
    .line 1424
    check-cast v1, Lla2;

    .line 1425
    .line 1426
    invoke-interface {v0, v1, v6}, Landroid/os/IBinder;->unlinkToDeath(Landroid/os/IBinder$DeathRecipient;I)Z

    .line 1427
    .line 1428
    .line 1429
    iput-object v5, p0, Lan4;->L:Ljava/lang/Object;

    .line 1430
    .line 1431
    iput-boolean v6, p0, Lan4;->a:Z

    .line 1432
    .line 1433
    return-void

    .line 1434
    :pswitch_16
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1435
    .line 1436
    check-cast p0, Lpb5;

    .line 1437
    .line 1438
    invoke-virtual {p0}, Lpb5;->e()V

    .line 1439
    .line 1440
    .line 1441
    return-void

    .line 1442
    :pswitch_17
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1443
    .line 1444
    check-cast p0, Ljb5;

    .line 1445
    .line 1446
    new-instance v0, Lwo0;

    .line 1447
    .line 1448
    const/4 v1, 0x6

    .line 1449
    invoke-direct {v0, p0, v1}, Lwo0;-><init>(Ljava/lang/Object;I)V

    .line 1450
    .line 1451
    .line 1452
    :try_start_10
    iget-object p0, p0, Ljb5;->a:Landroid/content/Context;

    .line 1453
    .line 1454
    const-string v1, "connectivity"

    .line 1455
    .line 1456
    invoke-virtual {p0, v1}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    .line 1457
    .line 1458
    .line 1459
    move-result-object p0

    .line 1460
    if-eqz p0, :cond_21

    .line 1461
    .line 1462
    check-cast p0, Landroid/net/ConnectivityManager;

    .line 1463
    .line 1464
    invoke-virtual {p0, v0}, Landroid/net/ConnectivityManager;->registerDefaultNetworkCallback(Landroid/net/ConnectivityManager$NetworkCallback;)V

    .line 1465
    .line 1466
    .line 1467
    goto :goto_15

    .line 1468
    :cond_21
    throw v5
    :try_end_10
    .catchall {:try_start_10 .. :try_end_10} :catchall_6

    .line 1469
    :catchall_6
    :goto_15
    return-void

    .line 1470
    :pswitch_18
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1471
    .line 1472
    check-cast p0, Lib5;

    .line 1473
    .line 1474
    new-instance v0, Lft4;

    .line 1475
    .line 1476
    const/16 v1, 0xd

    .line 1477
    .line 1478
    invoke-direct {v0, p0, v1}, Lft4;-><init>(Ljava/lang/Object;I)V

    .line 1479
    .line 1480
    .line 1481
    iget-object v1, p0, Lib5;->c:Luv3;

    .line 1482
    .line 1483
    invoke-virtual {v1, v0}, Luv3;->j(Ljava/util/concurrent/Callable;)Lcom/google/common/util/concurrent/ListenableFuture;

    .line 1484
    .line 1485
    .line 1486
    move-result-object v0

    .line 1487
    iget-object v1, p0, Lib5;->b:Lrb5;

    .line 1488
    .line 1489
    const/16 v2, 0x35

    .line 1490
    .line 1491
    invoke-virtual {v1, v2, v0}, Lrb5;->e(ILcom/google/common/util/concurrent/ListenableFuture;)V

    .line 1492
    .line 1493
    .line 1494
    iput-object v0, p0, Lib5;->f:Lcom/google/common/util/concurrent/ListenableFuture;

    .line 1495
    .line 1496
    return-void

    .line 1497
    :pswitch_19
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1498
    .line 1499
    check-cast p0, Lm95;

    .line 1500
    .line 1501
    invoke-virtual {p0}, Lm95;->a()Lfj5;

    .line 1502
    .line 1503
    .line 1504
    return-void

    .line 1505
    :pswitch_1a
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1506
    .line 1507
    check-cast p0, Lf95;

    .line 1508
    .line 1509
    iget-object v0, p0, Lf95;->a:Le56;

    .line 1510
    .line 1511
    invoke-interface {v0}, Le56;->zzb()Ljava/lang/Object;

    .line 1512
    .line 1513
    .line 1514
    move-result-object v0

    .line 1515
    check-cast v0, Lm95;

    .line 1516
    .line 1517
    iget-wide v5, p0, Lf95;->e:J

    .line 1518
    .line 1519
    cmp-long p0, v5, v3

    .line 1520
    .line 1521
    if-lez p0, :cond_22

    .line 1522
    .line 1523
    iget-object p0, v0, Lm95;->e:Li65;

    .line 1524
    .line 1525
    new-instance v1, La25;

    .line 1526
    .line 1527
    invoke-direct {v1, v0, v2}, La25;-><init>(Ljava/lang/Object;I)V

    .line 1528
    .line 1529
    .line 1530
    invoke-interface {p0, v1, v5, v6}, Li65;->a(Ljava/lang/Runnable;J)V

    .line 1531
    .line 1532
    .line 1533
    goto :goto_16

    .line 1534
    :cond_22
    invoke-virtual {v0}, Lm95;->a()Lfj5;

    .line 1535
    .line 1536
    .line 1537
    :goto_16
    return-void

    .line 1538
    :pswitch_1b
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1539
    .line 1540
    check-cast p0, Ljava/net/HttpURLConnection;

    .line 1541
    .line 1542
    invoke-virtual {p0}, Ljava/net/HttpURLConnection;->disconnect()V

    .line 1543
    .line 1544
    .line 1545
    return-void

    .line 1546
    :pswitch_1c
    iget-object p0, p0, La25;->b:Ljava/lang/Object;

    .line 1547
    .line 1548
    check-cast p0, Ld25;

    .line 1549
    .line 1550
    iget-object p0, p0, Ld25;->e:Lty2;

    .line 1551
    .line 1552
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 1553
    .line 1554
    .line 1555
    new-instance v0, Lf25;

    .line 1556
    .line 1557
    invoke-direct {v0, p0}, Le25;-><init>(Lty2;)V

    .line 1558
    .line 1559
    .line 1560
    iget-object p0, p0, Lty2;->c:Ljava/lang/Object;

    .line 1561
    .line 1562
    check-cast p0, Lmd4;

    .line 1563
    .line 1564
    iput-object p0, v0, Le25;->a:Lmd4;

    .line 1565
    .line 1566
    iget-object v1, p0, Lmd4;->b:Ljava/lang/Object;

    .line 1567
    .line 1568
    check-cast v1, Ljava/util/ArrayDeque;

    .line 1569
    .line 1570
    invoke-virtual {v1, v0}, Ljava/util/ArrayDeque;->add(Ljava/lang/Object;)Z

    .line 1571
    .line 1572
    .line 1573
    iget-object v0, p0, Lmd4;->c:Ljava/lang/Object;

    .line 1574
    .line 1575
    check-cast v0, Le25;

    .line 1576
    .line 1577
    if-nez v0, :cond_23

    .line 1578
    .line 1579
    invoke-virtual {v1}, Ljava/util/ArrayDeque;->poll()Ljava/lang/Object;

    .line 1580
    .line 1581
    .line 1582
    move-result-object v0

    .line 1583
    check-cast v0, Le25;

    .line 1584
    .line 1585
    iput-object v0, p0, Lmd4;->c:Ljava/lang/Object;

    .line 1586
    .line 1587
    if-eqz v0, :cond_23

    .line 1588
    .line 1589
    iget-object p0, p0, Lmd4;->a:Ljava/lang/Object;

    .line 1590
    .line 1591
    check-cast p0, Ljava/util/concurrent/ThreadPoolExecutor;

    .line 1592
    .line 1593
    new-array v1, v6, [Ljava/lang/Object;

    .line 1594
    .line 1595
    invoke-virtual {v0, p0, v1}, Landroid/os/AsyncTask;->executeOnExecutor(Ljava/util/concurrent/Executor;[Ljava/lang/Object;)Landroid/os/AsyncTask;

    .line 1596
    .line 1597
    .line 1598
    :cond_23
    return-void

    .line 1599
    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_1c
        :pswitch_1b
        :pswitch_1a
        :pswitch_19
        :pswitch_18
        :pswitch_17
        :pswitch_16
        :pswitch_15
        :pswitch_14
        :pswitch_13
        :pswitch_12
        :pswitch_11
        :pswitch_10
        :pswitch_f
        :pswitch_e
        :pswitch_d
        :pswitch_c
        :pswitch_b
        :pswitch_a
        :pswitch_9
        :pswitch_8
        :pswitch_7
        :pswitch_6
        :pswitch_5
        :pswitch_4
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method
