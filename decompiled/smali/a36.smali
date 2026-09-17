.class public final La36;
.super Lj06;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# static fields
.field private static final zzc:La36;

.field private static volatile zzd:Lm16;


# instance fields
.field private zza:I

.field private zzb:Ljava/lang/String;


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .line 1
    new-instance v0, La36;

    .line 2
    .line 3
    invoke-direct {v0}, La36;-><init>()V

    .line 4
    .line 5
    .line 6
    sput-object v0, La36;->zzc:La36;

    .line 7
    .line 8
    const-class v1, La36;

    .line 9
    .line 10
    invoke-static {v1, v0}, Lj06;->t(Ljava/lang/Class;Lj06;)V

    .line 11
    .line 12
    .line 13
    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .line 1
    invoke-direct {p0}, Lj06;-><init>()V

    .line 2
    .line 3
    .line 4
    const-string v0, ""

    .line 5
    .line 6
    iput-object v0, p0, La36;->zzb:Ljava/lang/String;

    .line 7
    .line 8
    return-void
.end method

.method public static z()Lz26;
    .locals 1

    .line 1
    sget-object v0, La36;->zzc:La36;

    .line 2
    .line 3
    invoke-virtual {v0}, Lj06;->q()Lh06;

    .line 4
    .line 5
    .line 6
    move-result-object v0

    .line 7
    check-cast v0, Lz26;

    .line 8
    .line 9
    return-object v0
.end method


# virtual methods
.method public final synthetic A(Ljava/lang/String;)V
    .locals 1

    .line 1
    iget v0, p0, La36;->zza:I

    .line 2
    .line 3
    or-int/lit8 v0, v0, 0x1

    .line 4
    .line 5
    iput v0, p0, La36;->zza:I

    .line 6
    .line 7
    iput-object p1, p0, La36;->zzb:Ljava/lang/String;

    .line 8
    .line 9
    return-void
.end method

.method public final v(ILj06;)Ljava/lang/Object;
    .locals 1

    .line 1
    invoke-static {p1}, Lbo;->y(I)I

    .line 2
    .line 3
    .line 4
    move-result p0

    .line 5
    if-eqz p0, :cond_7

    .line 6
    .line 7
    const/4 p1, 0x2

    .line 8
    if-eq p0, p1, :cond_6

    .line 9
    .line 10
    const/4 p1, 0x3

    .line 11
    if-eq p0, p1, :cond_5

    .line 12
    .line 13
    const/4 p1, 0x4

    .line 14
    if-eq p0, p1, :cond_4

    .line 15
    .line 16
    const/4 p1, 0x5

    .line 17
    if-eq p0, p1, :cond_3

    .line 18
    .line 19
    const/4 p1, 0x6

    .line 20
    if-ne p0, p1, :cond_2

    .line 21
    .line 22
    sget-object p0, La36;->zzd:Lm16;

    .line 23
    .line 24
    if-nez p0, :cond_1

    .line 25
    .line 26
    const-class p1, La36;

    .line 27
    .line 28
    monitor-enter p1

    .line 29
    :try_start_0
    sget-object p0, La36;->zzd:Lm16;

    .line 30
    .line 31
    if-nez p0, :cond_0

    .line 32
    .line 33
    new-instance p0, Li06;

    .line 34
    .line 35
    sget-object p2, La36;->zzc:La36;

    .line 36
    .line 37
    invoke-direct {p0, p2}, Li06;-><init>(Lj06;)V

    .line 38
    .line 39
    .line 40
    sput-object p0, La36;->zzd:Lm16;

    .line 41
    .line 42
    goto :goto_0

    .line 43
    :catchall_0
    move-exception p0

    .line 44
    goto :goto_1

    .line 45
    :cond_0
    :goto_0
    monitor-exit p1

    .line 46
    return-object p0

    .line 47
    :goto_1
    monitor-exit p1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 48
    throw p0

    .line 49
    :cond_1
    return-object p0

    .line 50
    :cond_2
    const/4 p0, 0x0

    .line 51
    throw p0

    .line 52
    :cond_3
    sget-object p0, La36;->zzc:La36;

    .line 53
    .line 54
    return-object p0

    .line 55
    :cond_4
    new-instance p0, Lz26;

    .line 56
    .line 57
    sget-object p1, La36;->zzc:La36;

    .line 58
    .line 59
    invoke-direct {p0, p1}, Lh06;-><init>(Lj06;)V

    .line 60
    .line 61
    .line 62
    return-object p0

    .line 63
    :cond_5
    new-instance p0, La36;

    .line 64
    .line 65
    invoke-direct {p0}, La36;-><init>()V

    .line 66
    .line 67
    .line 68
    return-object p0

    .line 69
    :cond_6
    const-string p0, "zza"

    .line 70
    .line 71
    const-string p1, "zzb"

    .line 72
    .line 73
    filled-new-array {p0, p1}, [Ljava/lang/Object;

    .line 74
    .line 75
    .line 76
    move-result-object p0

    .line 77
    sget-object p1, La36;->zzc:La36;

    .line 78
    .line 79
    const-string p2, "\u0001\u0001\u0000\u0001\u0001\u0001\u0001\u0000\u0000\u0000\u0001\u1008\u0000"

    .line 80
    .line 81
    new-instance v0, Lq16;

    .line 82
    .line 83
    invoke-direct {v0, p1, p2, p0}, Lq16;-><init>(Lkz5;Ljava/lang/String;[Ljava/lang/Object;)V

    .line 84
    .line 85
    .line 86
    return-object v0

    .line 87
    :cond_7
    const/4 p0, 0x1

    .line 88
    invoke-static {p0}, Ljava/lang/Byte;->valueOf(B)Ljava/lang/Byte;

    .line 89
    .line 90
    .line 91
    move-result-object p0

    .line 92
    return-object p0
.end method
